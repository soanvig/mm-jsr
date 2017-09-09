const data = {
  modules: null,
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
}

function bindEvents (eventizer) {
  eventizer.register('view/slider:click', (event) => {
    console.log('JSR: Slider clicked.');
    console.log(event);
  });

  eventizer.register('view/rail:click', (event) => {
    console.log('JSR: Rail clicked.');
    console.log(event);
    setValue(event.data.clickRatio);
  });
}

export default {
  build ({ modules }) {
    if (!data.modules) {
      data.modules = modules;
    }
  },

  init () {
    bindEvents(data.modules.eventizer);
    data.modules.renderer.appendRoot('body');
    setValue(0.33, 0);
    setValue(0.66, 1);
    console.info('JSR: Core initiated.');
  }
};