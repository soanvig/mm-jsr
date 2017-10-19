import merge from 'deepmerge';

export default class {
  _bindEvents () {
    
  }

  /* API */
  build ({ config, modules, logger }) {
    const defaults = {
      customRange: true,

    };
    this.logger = logger;
    this.config = merge(defaults, config);
    this.modules = modules;

    this._bindEvents();
  }
}