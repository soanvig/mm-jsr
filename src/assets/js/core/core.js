import { throttle } from '../helpers.js';

let logger = null;
const data = {
  modules: null,
  config: {
    min: 50,
    max: 150,
    step: 10
  },
  values: []
};

// Determines, how many decimal places the (float) number has
function calculateDecimals (number) {
  const string = number.toString().split('.');
  if (string[1]) {
    return string[1].length;
  }

  return 0;
}

function calculateStepRatio (step, min, max) {
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

  value = roundToStep(value, data.stepRatio, data.stepRatioDecimals);
  data.values[id] = value;
  data.modules.renderer.setSliderValue(id, value);

  data.modules.eventizer.trigger('core/value:update', id, value);
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
}

export default {
  build ({ modules, log }) {
    data.modules = modules || data.modules;
    logger = log;
  },

  init ({ values }) {
    data.stepRatio = calculateStepRatio(data.config.step, data.config.min, data.config.max);
    data.stepRatioDecimals = calculateDecimals(data.stepRatio);

    bindEvents(data.modules.eventizer);
    data.modules.renderer.appendRoot('body');
    setValue(values[0], 0);
    setValue(values[1], 1);
    logger.info('JSR: Core initiated.');
  },

  getValue (id) {
    const value = data.values[id];
    return (data.config.max - data.config.min) * value + data.config.min;
  }
};