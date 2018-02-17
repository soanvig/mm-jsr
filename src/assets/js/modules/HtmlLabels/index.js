class HtmlLabels {
  _bindEvents () {
    // For each id of input
    this.inputs.map((input) => input.id).forEach((id, index) => {
      // Find label with that target
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) {
        label.addEventListener('click', () => {
          this.modules.renderer.body.sliders[index].focus();
        });
      }
    });
  }

  /* API */
  build ({ config, modules, logger }, specificConfig) {
    this.logger = logger;
    this.config = config;
    this.modules = modules;
    this.inputs = specificConfig.inputs;

    this._bindEvents();
  }
}

export default {
  name: 'htmlLabels',
  Klass: HtmlLabels
};