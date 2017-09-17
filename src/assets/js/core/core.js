import { throttle, calculateDecimals } from '../helpers.js';

/* Private methods. Require to be called with .call(this, ...args) */

// Converts real value to ratio value used by script 
function realToRatio (value) {
  const min = this.config.min;
  const max = this.config.max;

  return (value - min) / (max - min); 
}

// Rounds value to step
function roundToStep (value) {
  const step = this.config.step;
  const stepDecimalsMultiplier = Math.pow(10, this.stepRatioDecimals);

  value = Math.round(value / step) * step;
  
  return Math.round(value * stepDecimalsMultiplier) / stepDecimalsMultiplier;
}

// Converts ratio value used by script to real value from min/max
function ratioToReal (value) {
  const min = this.config.min;
  const max = this.config.max;
  value = (max - min) * value + min;

  return roundToStep.call(this, value);
}

// Calculates step in terms of ratio
function calculateStepRatio () {
  const min = this.config.min;
  const max = this.config.max;
  const step = this.config.step;

  return (step / (max - min));
}

// Rounds value to step ratio
function roundToStepRatio (value) {
  const step = this.stepRatio;
  const stepDecimalsMultiplier = Math.pow(10, this.stepRatioDecimals);

  value = Math.round(value / step) * step;

  return Math.round(value * stepDecimalsMultiplier) / stepDecimalsMultiplier;
}

// Returns id of value in this.values, which is closest to `lookupVal`
function findClosestValue (lookupVal) {
  let diff = 1;
  let id = 0;

  this.values.forEach((value, index) => {
    const actualDiff = Math.abs(value - lookupVal);
    if (actualDiff < diff) {
      id = index;
      diff = actualDiff;
    }
  });

  return id;
}

export default class {
  constructor () {
    // This lists all available in-object variables
    this.logger = null;
    this.config = {
      min: 0,
      max: 0,
      step: 0
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
    id = (id === null) ? findClosestValue.call(this, value) : parseInt(id);

    if (diff) {
      value = this.valueInMove[id] + value;
    }

    // Value cannot exceed min/max
    if (value < 0) {
      value = 0;
    } else if (value > 1) {
      value = 1;
    }
  
    // Value cannot exceed neighbour values
    if ((typeof this.values[id - 1] !== 'undefined') && value < this.values[id - 1]) {
      value = this.values[id - 1];
    }
    
    if ((typeof this.values[id + 1] !== 'undefined') && value > this.values[id + 1]) {
      value = this.values[id + 1];
    }
  
    const roundedValue = roundToStepRatio.call(this, value);
    if (roundedValue === this.values[id]) {
      // Nothing changed
      return;
    }
  
    this.values[id] = roundedValue;
    this.modules.renderer.setSliderValue(roundedValue, id);

    this.modules.eventizer.trigger('core/value:update', id, ratioToReal.call(this, roundedValue), roundedValue);
  }

  _bindEvents () {
    const eventizer = this.modules.eventizer;

    eventizer.register('view/slider:mousedown', (event, slidersId) => {
      this.logger.debug('JSR: Slider mousedown.');
      this.logger.debug(event);

      slidersId.forEach((slider) => {
        this.valueInMove[slider] = this.values[slider];
      });
    });
  
    eventizer.register('view/slider:mousemove', (event, id, diff) => {
      throttle('slider-mousemove', 10, () => {
        this.logger.debug('JSR: Slider mousemove.');
        this.logger.debug(event);

        this._setValue(diff, id, true);
      });
    });
  
    eventizer.register('view/slider:mouseup', (event) => {
      this.logger.debug('JSR: Slider mouseup.');
      this.logger.debug(event);
    });
  
    eventizer.register('view/rail:click', (event, value) => {
      this.logger.debug('JSR: Rail clicked.');
      this.logger.debug(event);
      this._setValue(value);
    });
  
    eventizer.register('view/root:arrow', (event, id, direction) => {
      const actualValue = this.values[id];
      const twentiethRange = 0.05;
      const increaseBy = event.shiftKey ? twentiethRange
        : (event.ctrlKey ? this.stepRatio * 10 : this.stepRatio);
  
      const newValue = actualValue + increaseBy * direction;
      this._setValue(newValue, id);
    });

    eventizer.register('view/bar:mousedown', (event, id) => {
      this.logger.debug('JSR: Bar mousedown.');
      this.logger.debug(event);
      
      this.valueInMove[id] = this.values[id];
      this.valueInMove[id + 1] = this.values[id + 1];
    });
  
    eventizer.register('view/bar:mousemove', (event, id, diff) => {
      throttle('bar-mousemove', 10, () => {
        this.logger.debug('JSR: Bar mousemove.');
        this.logger.debug(event);

        this._setValue(diff, id, true);
        this._setValue(diff, id + 1, true);
      });
    });
  
    eventizer.register('view/bar:mouseup', (event) => {
      this.logger.debug('JSR: Bar mouseup.');
      this.logger.debug(event);
    });
  }

  /* API */
  build ({ config, modules, logger }) {
    this.config = config;
    this.logger = logger;
    this.modules = modules;

    this.stepRatio = calculateStepRatio.call(this);
    this.stepRatioDecimals = calculateDecimals(this.stepRatio);
  }

  init (input, values) {
    // Renderer should be applied to body before setting values.
    this.modules.renderer.appendRoot(input);
    
    values.forEach((value, index) => {
      value = realToRatio.call(this, value);
      this._setValue(value, index);
    });
    
    this._bindEvents();

    this.logger.info('JSR: Core initiated on input.', input);
  }

  getValue (id) {
    const value = this.values[id];
    return ratioToReal.call(this, value);
  }

  setValue (value, id) {
    this._setValue(value, id);
  }
}