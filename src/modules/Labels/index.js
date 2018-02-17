import { listenOn, calculateDecimals } from '@/helpers';
import debounce from 'debounce';
import merge from 'deepmerge';

function allLabelsSet () {
  const setValuesCount = this.values.filter((value) => value !== undefined).length;
  if (setValuesCount === this.config.values.length) {
    return true;
  }

  return false;
}

function mergeLabels (into, what) {
  this.mergedLabels.push(what);
  this.labels[into].appendChild(this.labels[what]);
}

function undoMergeLabels () {
  this.mergedLabels.forEach((label) => {
    this.labelsParent.appendChild(this.labels[label]);
  });
  this.mergedLabels = [];
}

function handleOverlappingBecauseItIsVeryFuckedUp () {
  const labels = this.labels;
  const labelSpacing = 5;

  // Unmerge all labels
  undoMergeLabels.call(this);

  // Now compare each label (firstLabel) with next label (nextLabel)
  let firstLabel = 0;
  let nextLabel = firstLabel + 1;
  // Exit while nextLabel exceeds last existing label
  analyzeLoop: while (nextLabel < labels.length) {
    // If first label overlaps next label
    // And next label's parent isn't a label
    if (labels[firstLabel].getBoundingClientRect().right + labelSpacing >= labels[nextLabel].getBoundingClientRect().left) {
      // Merge labels
      mergeLabels.call(this, firstLabel, nextLabel);
      // Move comparison to next label:
      nextLabel += 1;
      // Continue with new iteration
      continue;
    }

    // Otherwise compare new labels:
    firstLabel += 1;
    nextLabel += 1;
  }

  // Finally do things with minmax labels (compare only first and last labels)
  if (this.minMax[0].getBoundingClientRect().right + labelSpacing >= this.labels[0].getBoundingClientRect().left) {
    this.minMax[0].style.opacity = '0';
  } else {
    this.minMax[0].style.opacity = '1';
  }

  if (this.labels[this.labels.length - 1].getBoundingClientRect().right + labelSpacing >= this.minMax[1].getBoundingClientRect().left) {
    this.minMax[1].style.opacity = '0';
  } else {
    this.minMax[1].style.opacity = '1';
  }
}

function updateLabel (id, real, ratio) {
  const label = this.labels[id];

  // Fill real value with appropriate number of zeros
  if (this.config.step < 1) {
    const realDecimals = calculateDecimals(real);
    const stepDecimals = calculateDecimals(this.config.step);
    const decimalsDiff = stepDecimals - realDecimals;
    if (decimalsDiff > 0) {
      // Adds zeros
      const realSplit = real.toString().split('.');
      real = `${realSplit[0]}.${realSplit[1] || 0}${Array(decimalsDiff).join('0')}`;
    }
  }

  // Update value
  label.innerHTML = this.formatter ? this.formatter(real) : real;
  this.values[id] = ratio;

  // Update position
  let labelRect = label.getBoundingClientRect();

  label.style.left = `calc(${ratio * 100}% - ${labelRect.width / 2}px)`;

  // Handle overlapping only if all labels are set
  if (allLabelsSet.call(this)) {
    handleOverlappingBecauseItIsVeryFuckedUp.call(this);
  }

  // Handle exceeding parent
  const rootRect = this.modules.renderer.body.root.getBoundingClientRect();
  labelRect = label.getBoundingClientRect();
  if (labelRect.right > rootRect.right) {
    label.style.left = `calc(100% - ${labelRect.width}px)`;
  }

  if (labelRect.left < rootRect.left) {
    label.style.left = '0';
  }
}

class Labels {
  constructor () {
    this.labels = [];
    this.minMax = [];
    this.values = [];
    this.labelsParent = null;
    this.mergedLabels = [];
  }

  _bindEvents () {
    const eventizer = this.modules.eventizer;

    eventizer.register('core/value:update', (id, real, ratio) => {
      this.values[id] = [real, ratio];
      updateLabel.call(this, id, real, ratio);
    });

    // Delegate this event to renderer slider click
    eventizer.register('view/mousedown', (event) => {
      if (!event.target.classList.contains('jsr_label')) {
        return;
      }

      event.stopPropagation();

      const clickEvent = new MouseEvent('mousedown', event);
      this.modules.renderer.body.sliders[event.target.dataset.jsrId].dispatchEvent(clickEvent);
    });

    // Update label merging
    listenOn(window, 'resize',
      debounce(() => {
        handleOverlappingBecauseItIsVeryFuckedUp.call(this);
      }, 100)
    );
  }

  _parseMinMax () {
    this.minMax[0].innerHTML = this.formatter ? this.formatter(this.config.min) : this.config.min;
    this.minMax[1].innerHTML = this.formatter ? this.formatter(this.config.max) : this.config.max;

    this.minMax[0].style.left = '0%';
    this.minMax[1].style.right = '0%';

    if (!this.config.labels.minMax) {
      this.minMax[0].style.display = 'none';
      this.minMax[1].style.display = 'none';
    }
  }

  build ({ config, modules, logger }) {
    const defaults = {
      labels: {
        minMax: true,
        formatter: null
      }
    };
    this.logger = logger;
    this.config = merge(defaults, config);
    this.modules = modules;

    this.formatter = this.config.labels.formatter;

    this.modules.eventizer.register('modules/renderer:builded', () => {
      this.labels = this.modules.renderer.body.labels;
      this.labelsParent = this.labels[0].parentNode;

      this.minMax = this.modules.renderer.body.labelsMinMax;
      this._parseMinMax();

      this._bindEvents();
    });
  }

  refresh (config) {
    this.config = merge(this.config, config, { arrayMerge: (dest, source) => source });
    this.formatter = this.config.labels.formatter;
    this._parseMinMax();
    handleOverlappingBecauseItIsVeryFuckedUp.call(this);

    this.logger.debug('JSR: labels refreshed');
  }

  view () {
    const labels = {
      classes: ['jsr_label'],
      children: [],
      count: this.config.sliders,
      alwaysArray: true,
      parent: 'rail',
      name: 'labels'
    };

    const labelsMinMax = {
      classes: ['jsr_label', 'jsr_label--minmax'],
      children: [],
      count: 2,
      parent: 'rail',
      name: 'labelsMinMax'
    };

    return [labels, labelsMinMax];
  }
}

export default {
  name: 'labels',
  Klass: Labels
};