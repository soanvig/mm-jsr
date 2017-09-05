const data = {
  modules: null
}

export default {
  build ({ modules }) {
    if (!data.modules) {
      data.modules = modules;
    }
  },

  init () {
    data.modules.renderer.appendRoot('body');
  }
};