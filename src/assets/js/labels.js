import { listenOn } from './helpers.js';

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
}

function updateLabel (id, real, ratio) {
  const label = this.labels[id];

  // Update value
  label.innerHTML = real;
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

export default class {
  constructor () {
    this.labels = [];
    this.values = [];
    this.labelsParent = null;
    this.mergedLabels = [];
  }

  _bindEvents () {
    listenOn(this.labels, 'click', (event) => {
      event.stopPropagation();
    });

    this.modules.eventizer.register('core/value:update', (id, real, ratio) => {
      this.values[id] = [real, ratio];
      updateLabel.call(this, id, real, ratio);
    });

    // Delegate this event to renderer slider click
    listenOn(this.labels, 'mousedown', (event) => {
      const clickEvent = new MouseEvent('mousedown', event);
      this.modules.renderer.body.sliders[event.target.dataset.jsrId].dispatchEvent(clickEvent);
    });
  }
  
  build ({ config, modules, logger }) {
    this.logger = logger;
    this.config = config;
    this.modules = modules;

    this.modules.renderer.structure.labels = {
      classes: ['jsr_label'],
      children: [],
      count: this.config.sliders,
      alwaysArray: true
    };

    this.modules.renderer.structure.rail.children.push('labels');

    this.modules.eventizer.register('modules/renderer:builded', () => {
      this.labels = this.modules.renderer.body.labels;
      this.labelsParent = this.labels[0].parentNode;
      this._bindEvents();
    });
  }
} 