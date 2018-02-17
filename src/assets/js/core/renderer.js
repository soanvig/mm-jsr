import structureParser from './structureParser.js';
import { listenOn } from '../helpers.js';
import merge from 'deepmerge';

/* Private methods. Require to be called with .call(this, ...args) */

// Returns ids of sliders with the same value as slider with sliderNum id
function getSlidersWithSameValue (sliderNum) {
  const sliders = [];

  this.values.forEach((value, index) => {
    if (value === this.values[sliderNum]) {
      sliders.push(index);
    }
  });

  return sliders;
}

class Renderer {
  constructor () {
    // This lists all available in-object variables
    this.logger = null;
    this.config = {};
    this.modules = {};
    this.temp = {
      sliderInMove: null,
      sliderClickX: 0,
      barInMove: null,
      barClickX: 0
    };
    this.values = [];
    this.body = {};
    this.bodyStructure = {
      root: {
        classes: ['jsr'],
        count: 1
      }
    };
  }

  _bindEvents () {
    const eventizer = this.modules.eventizer;

    // Slider
    listenOn(this.body.sliders, 'click', (event) => {
      event.stopPropagation();
    });
    listenOn(this.body.sliders, 'mousedown', (event) => {
      event.stopPropagation();

      this.temp.sliderInMove = parseInt(event.target.dataset.jsrId);
      this.temp.sliderClickX = event.clientX;

      const slidersWithSameValue = getSlidersWithSameValue.call(this, this.temp.sliderInMove);
      if (slidersWithSameValue.length > 1) {
        this.temp.sliderInMove = slidersWithSameValue;
      }

      eventizer.trigger('view/slider:mousedown', event, slidersWithSameValue);
    });
    listenOn(document, 'mousemove', (event) => {
      event.stopPropagation();

      if (this.temp.sliderInMove === null) {
        return;
      }

      if (this.temp.sliderInMove instanceof Array) {
        // This situation means, that there is more than one slider in one position
        // Determine direction of move and select good slider
        if (event.clientX < this.temp.sliderClickX) {
          // Move to left, take first slider
          this.temp.sliderInMove = this.temp.sliderInMove[0];
        } else {
          // Move to right, take last slider
          this.temp.sliderInMove = this.temp.sliderInMove.pop();
        }
      }

      // Now, if its certain which slider should be move, focus it and make active!
      this.body.sliders[this.temp.sliderInMove].focus();
      this.body.sliders[this.temp.sliderInMove].classList.add('jsr_slider--active');

      // Calculate the difference between the position where slider was clicked and where the mouse cursor is now.
      // Plus convert it into rationed value.
      const diff = event.clientX - this.temp.sliderClickX;
      const diffRatio = diff / this.body.railOuter.offsetWidth;

      eventizer.trigger('view/slider:mousemove', event, this.temp.sliderInMove, diffRatio);
    });
    listenOn(document, 'mouseup', (event) => {
      if (this.temp.sliderInMove === null) {
        return;
      }

      // Clear active class on all sliders
      this.body.sliders.forEach((slider) => {
        slider.classList.remove('jsr_slider--active');
      });

      eventizer.trigger('view/slider:mouseup', event, this.temp.sliderInMove);
      this.temp.sliderInMove = null;
    });
    // ./ Slider

    // Rail
    listenOn(this.body.railOuter, 'mouseup', (event) => {
      if (this.temp.barIsMoved) {
        return;
      }

      const clickX = event.clientX;
      const railLeft = this.body.railOuter.getBoundingClientRect().left;
      const clickRelative = clickX - railLeft;
      const ratio = clickRelative / this.body.railOuter.offsetWidth;

      eventizer.trigger('view/rail:click', event, ratio);
    });
    // ./ Rail

    // Bar
    if (this.body.bars) {
      listenOn(this.body.bars, 'mousedown', (event) => {
        this.temp.barInMove = parseInt(event.target.dataset.jsrId);
        this.temp.barClickX = event.clientX;

        eventizer.trigger('view/bar:mousedown', event, this.temp.barInMove);
      });
      listenOn(document, 'mousemove', (event) => {
        if (this.temp.barInMove === null) {
          return;
        }

        this.temp.barIsMoved = true;

        // Calculate the difference between the position where bar was clicked and where the mouse cursor is now.
        // Plus convert it into rationed value.
        const diff = event.clientX - this.temp.barClickX;
        const diffRatio = diff / this.body.railOuter.offsetWidth;

        eventizer.trigger('view/bar:mousemove', event, this.temp.barInMove, diffRatio);
      });
      listenOn(document, 'mouseup', (event) => {
        if (this.temp.barInMove === null) {
          return;
        }

        eventizer.trigger('view/bar:mouseup', event, this.temp.barInMove);

        this.temp.barInMove = null;
        this.temp.barIsMoved = false;
      });
    }
    // ./ Bar

    // Keyboard
    listenOn(this.body.root, 'keydown', (event) => {
      // Its slider presumably, cuz only slider can have focus
      const sliderId = event.target.dataset.jsrId;
      const keyCodes = {
        '37': -1, // left
        '38': +1, // up
        '39': +1, // right
        '40': -1 // down
      };

      // If the left, up, down or right arrow was pressed
      const key = keyCodes[event.keyCode.toString()];
      if (!key) {
        return false;
      }

      // Prevent default, to disable functions like selecting text
      // Because of condition above it doesn't block other keys like TAB
      event.preventDefault();
      eventizer.trigger('view/root:arrow', event, sliderId, key);
    });
    // ./ Keyboard
  }

  // Updates bars which are neighbour to sliderNum (value is this slider value).
  _updateBars (sliderNum, value) {
    if (!this.body.bars) {
      return;
    }

    const leftBar = this.body.bars[sliderNum - 1];
    const rightBar = this.body.bars[sliderNum];

    if (leftBar) {
      leftBar.style.right = `${(1 - value) * 100}%`;
    }

    if (rightBar) {
      rightBar.style.left = `${value * 100}%`;
    }
  }

  _createBody (start) {
    const structure = merge({}, this.bodyStructure);

    for (const moduleName in this.modules) {
      if (!this.modules[moduleName].view) {
        continue;
      }

      const view = this.modules[moduleName].view();
      view.forEach((singleView) => {
        structure[singleView.name] = singleView;
        if (!structure[singleView.parent].children) {
          structure[singleView.parent].children = [];
        }
        structure[singleView.parent].children.push(singleView.name);
      });
    }

    return structureParser(structure, start);
  }

  /* API */
  build ({ modules, logger, config }) {
    this.modules = modules;
    this.logger = logger;
    this.config = config;

    // Create body starting from root
    this.body = this._createBody('root');
    this._bindEvents();

    this.modules.eventizer.trigger('modules/renderer:builded');
  }

  // Appends root after target
  // @target should be HTML element
  appendRoot (target) {
    target.parentNode.insertBefore(this.body.root, target.nextSibling);
    this.modules.eventizer.trigger('modules/renderer:rootAppended');
  }

  setSliderValue (value, sliderNum) {
    const slider = this.body.sliders[sliderNum];
    const left = `${value * 100}%`;

    this.logger.debug(`JSR: Slider no. ${sliderNum} set to value: ${value}.`);

    this.values[sliderNum] = value;
    slider.style.left = left;

    this._updateBars(sliderNum, value);
  }
}

export default {
  name: 'renderer',
  Klass: Renderer
};