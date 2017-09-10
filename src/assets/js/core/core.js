const data = {
  modules: null,
  config: {
    min: 50,
    max: 150
  },
  values: []
};

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
  id = (id === null) ? findClosestValue(value) : id;

  data.values[id] = value;
  data.modules.renderer.setSliderValue(id, value);

  data.modules.eventizer.trigger('core/value:update', id, value);
}

function bindEvents (eventizer) {
  eventizer.register('view/slider:mousedown', (event) => {
    console.log('JSR: Slider mousedown.');
    console.log(event);
  });

  eventizer.register('view/slider:mousemove', (event, id) => {
    console.log('JSR: Slider mousemove.');
    console.log(event);
    setValue(event.data.ratio, id);
  });

  eventizer.register('view/slider:mouseup', (event) => {
    console.log('JSR: Slider mouseup.');
    console.log(event);
  });

  eventizer.register('view/rail:click', (event) => {
    console.log('JSR: Rail clicked.');
    console.log(event);
    setValue(event.data.ratio);
  });
}

export default {
  build ({ modules }) {
    data.modules = modules || data.modules;
  },

  init ({ values }) {
    bindEvents(data.modules.eventizer);
    data.modules.renderer.appendRoot('body');
    setValue(values[0], 0);
    setValue(values[1], 1);
    console.info('JSR: Core initiated.');
  },

  getValue (id) {
    const value = data.values[id];
    return (data.config.max - data.config.min) * value + data.config.min;
  }
};