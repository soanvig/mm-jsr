import { throttle } from '../helpers.js';

let logger = null;
const data = {
  modules: null,
  config: {
    min: 50,
    max: 150,
    step: 1
  },
  values: []
};

// Converts real value to ratio value used by script 
function realToRatio (value, min = data.config.min, max = data.config.max) {
  return (value - min) / (max - min); 
}

// Converts ratio value used by script to real value from min/max
function ratioToReal (value, min = data.config.min, max = data.config.max) {
  return (max - min) * value + min;
}

// Determines, how many decimal places the (float) number has
function calculateDecimals (number) {
  const string = number.toString().split('.');
  if (string[1]) {
    return string[1].length;
  }

  return 0;
}

function calculateStepRatio (step, min = data.config.min, max = data.config.max) {
  return (step / (max - min));
}

function roundToStep (value, step, decimals) {
  value = Math.round(value / step) * step;
  const stepDecimalsPow = Math.pow(10, decimals);
  return Math.round(value * stepDecimalsPow) / stepDecimalsPow;
}

/* Returns id of value in data.values, which is closest to `lookupVal` */
function findClosestValue (lookupVal) {
  let diff = 1;
  let id = 0;

  data.values.forEach((value, index) => {
    const actualDiff = Math.abs(value - lookupVal);
    if (actualDiff < diff) {
      id = index;
      diff = actualDiff;
    }
  });

  return id;
}

function setValue (value, id = null) {
  id = (id === null) ? findClosestValue(value) : parseInt(id);

  // Value cannot exceed min/max
  if (value < 0) {
    value = 0;
  }

  if (value > 1) {
    value = 1;
  }

  // Value cannot exceed neighbour values
  if ((typeof data.values[id - 1] !== 'undefined') && value < data.values[id - 1]) {
    value = data.values[id - 1];
  }
  
  if ((typeof data.values[id + 1] !== 'undefined') && value > data.values[id + 1]) {
    value = data.values[id + 1];
  }

  const roundedValue = roundToStep(value, data.stepRatio, data.stepRatioDecimals);
  if (roundedValue === data.values[id]) {
    return;
  }

  data.values[id] = roundedValue;
  data.modules.renderer.setSliderValue(id, roundedValue);

  data.modules.eventizer.trigger('core/value:update', id, ratioToReal(roundedValue));
}

function bindEvents (eventizer) {
  eventizer.register('view/slider:mousedown', (event) => {
    logger.debug('JSR: Slider mousedown.');
    logger.debug(event);
  });

  eventizer.register('view/slider:mousemove', (event, id) => {
    throttle('slider-mousemove', 10, () => {
      logger.debug('JSR: Slider mousemove.');
      logger.debug(event);
      setValue(event.data.ratio, id);
    });
  });

  eventizer.register('view/slider:mouseup', (event) => {
    logger.debug('JSR: Slider mouseup.');
    logger.debug(event);
  });

  eventizer.register('view/rail:click', (event) => {
    logger.debug('JSR: Rail clicked.');
    logger.debug(event);
    setValue(event.data.ratio);
  });

  eventizer.register('view/root:arrow', (event, id, direction) => {
    const actualValue = data.values[id];
    const twentiethRange = 0.05;
    const increaseBy = event.shiftKey ? twentiethRange
      : (event.ctrlKey ? data.stepRatio * 10 : data.stepRatio);

    const newValue = actualValue + increaseBy * direction;
    setValue(newValue, id);
  });
}

export default {
  build ({ modules, log }) {
    data.modules = modules || data.modules;
    logger = log;
  },

  init ({ values }) {
    data.stepRatio = calculateStepRatio(data.config.step);
    data.stepRatioDecimals = calculateDecimals(data.stepRatio);

    // Renderer should be applied to body before setting values.
    data.modules.renderer.appendRoot('body');

    values[0] = realToRatio(values[0]);
    values[1] = realToRatio(values[1]);
    setValue(values[0], 0);
    setValue(values[1], 1);
    
    bindEvents(data.modules.eventizer);

    logger.info('JSR: Core initiated.');
  },

  getValue (id) {
    const value = data.values[id];
    return ratioToReal(value);
  },

  setValue (id, value) {
    value = realToRatio(value);
    setValue(value, id);
  }
};