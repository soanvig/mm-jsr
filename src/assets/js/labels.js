export default class {
  constructor () {
    this.labels = {};
  }
  
  build ({ config, modules, logger }) {
    this.logger = logger;
    this.config = config;
    this.modules = modules;

    this.modules.renderer.structure.labels = {
      classes: ['jsr_label'],
      children: [],
      count: this.config.sliders
    };

    this.modules.renderer.structure.rail.children.push('labels');
  }
} 