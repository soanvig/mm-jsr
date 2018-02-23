import {
  calculateDecimals,
  findClosestValue,
  realToRatio,
  roundToStepRatio,
  ratioToReal,
  calculateStepRatio
} from '@/helpers';

import bindEvents from './bindEvents';
import merge from 'deepmerge';

class Core {
  constructor () {
    // This lists all available in-object variables
    this.logger = null;
    this.config = {
      min: 0,
      max: 0,
      step: 0
    };
    this.temp = {
      sliderInMove: null,
      sliderClickX: 0,
      barInMove: null,
      barClickX: 0
    };
    this.modules = {};
    this.values = [];
    this.valueInMove = [];
    this.stepRatio = 0;
    this.stepRatioDecimals = 0;
  }

  // If diff is set to true, then it calculates the value using:
  // - this.valueInMove (which is value saved during click).
  // - value (which is the difference between position during click and new mouse position).
  _setValue (value, id = null, diff = false) {
    if (!this.config.enabled) {
      return null;
    }

    id = (id === null) ? findClosestValue(this.values, value) : parseInt(id);

    if (diff) {
      value = this.valueInMove[id] + value;
    }

    // Value cannot exceed limit
    if (this.limit.min !== null && value < this.limit.min) {
      value = this.limit.min;
    }

    if (this.limit.max !== null && value > this.limit.max) {
      value = this.limit.max;
    }

    // Value cannot exceed neighbour values
    if ((typeof this.values[id - 1] !== 'undefined') && value < this.values[id - 1]) {
      value = this.values[id - 1];
    }

    if ((typeof this.values[id + 1] !== 'undefined') && value > this.values[id + 1]) {
      value = this.values[id + 1];
    }

    const roundedValue = roundToStepRatio(value, this.stepRatio);
    if (roundedValue === this.values[id]) {
      // Nothing changed
      return;
    }

    this.values[id] = roundedValue;
    this.setSliderValue(roundedValue, id);

    this.modules.eventizer.trigger(
      'core/value:update',
      id,
      ratioToReal(this.config.min, this.config.max, roundedValue, this.config.step),
      roundedValue
    );
  }

  // Updates bars which are neighbour to sliderNum (value is this slider value).
  _updateBars (sliderNum, value) {
    const body = this.modules.renderer.body;

    if (!body.bars) {
      return;
    }

    const leftBar = body.bars[sliderNum - 1];
    const rightBar = body.bars[sliderNum];

    if (leftBar) {
      leftBar.style.right = `${(1 - value) * 100}%`;
    }

    if (rightBar) {
      rightBar.style.left = `${value * 100}%`;
    }
  }

  setSliderValue (value, sliderNum) {
    const body = this.modules.renderer.body;
    const slider = body.sliders[sliderNum];
    const left = `${value * 100}%`;

    this.logger.debug(`JSR: Slider no. ${sliderNum} set to value: ${value}.`);

    this.values[sliderNum] = value;
    slider.style.left = left;

    this._updateBars(sliderNum, value);
  }

  _initValues () {
    this.values = [];
    this.config.values.forEach((value, index) => {
      value = realToRatio(this.config.min, this.config.max, value);
      this._setValue(value, index);
    });
  }

  _initLimits () {
    this.limit = {};
    this.setLimit('min', this.config.limit.min, true);
    this.setLimit('max', this.config.limit.max, true);
  }

  _initData () {
    this.stepRatio = calculateStepRatio(this.config.min, this.config.max, this.config.step);
    this.stepRatioDecimals = calculateDecimals(this.stepRatio);
  }

  /* API */
  build ({ config, modules, logger }) {
    this.config = config;
    this.logger = logger;
    this.modules = modules;

    this._initLimits();
    this._initData();
  }

  init (inputs) {
    // Renderer should be applied to body before setting values.
    this.modules.renderer.appendRoot(inputs[0]);

    this._initValues();

    bindEvents.call(this);

    this.logger.info('JSR: Core initiated.');
  }

  getValue (id) {
    const value = this.values[id];
    return ratioToReal(this.config.min, this.config.max, value, this.config.step);
  }

  refresh (config) {
    this.config = merge(this.config, config, { arrayMerge: (dest, source) => source });

    this._initLimits();
    this._initData();
    this._initValues();

    this.logger.debug('JSR: core refreshed');
  }

  setValue (value, id) {
    value = realToRatio(this.config.min, this.config.max, value);
    this._setValue(value, id);
  }

  setLimit (limit, value, initial = false) {
    if (value === null || typeof value === 'undefined') {
      this.limit[limit] = limit === 'min' ? 0 : 1;
    } else {
      this.limit[limit] = realToRatio(this.config.min, this.config.max, value);

      // Limit cannot be bigger than min/max
      if (this.limit[limit] < 0) {
        this.limit[limit] = 0;
      } else if (this.limit[limit] > 1) {
        this.limit[limit] = 1;
      }

      if (this.config.limit.show) {
        const body = this.modules.renderer.body.limitBar;
        body.style.left = `${this.limit.min * 100}%`;
        body.style.right = `${(1 - this.limit.max) * 100}%`;
      }

      // Refresh all values if it isn't initial set
      if (initial) {
        return;
      }

      this.values.forEach((value, index) => {
        this._setValue(value, index);
      });
    }
  }

  view () {
    const railOuter = {
      classes: ['jsr_rail-outer'],
      count: 1,
      name: 'railOuter',
      parent: 'root'
    };

    const rail = {
      classes: ['jsr_rail'],
      count: 1,
      name: 'rail',
      parent: 'railOuter'
    };

    const sliders = {
      classes: ['jsr_slider'],
      attributes: {
        tabindex: 0
      },
      count: this.config.sliders || 1,
      alwaysArray: true,
      name: 'sliders',
      parent: 'rail'
    };

    const bars = {
      classes: ['jsr_bar'],
      count: sliders.count - 1,
      alwaysArray: true,
      name: 'bars',
      parent: 'rail'
    };

    const limitBar = {
      classes: ['jsr_bar', 'jsr_bar--limit'],
      count: 1,
      name: 'limitBar',
      parent: 'rail'
    };

    return [
      railOuter,
      rail,
      sliders,
      bars,
      limitBar
    ];
  }
}

export default {
  name: 'core',
  Klass: Core
};