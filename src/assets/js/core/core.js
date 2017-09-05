const data = {
  modules: null
};

export default {
  build ({ modules }) {
    if (!data.modules) {
      data.modules = modules;
    }
  },

  init () {
    console.info('JSR: Core initiated.');
    data.modules.renderer.appendRoot('body');
  }
};