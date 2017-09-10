import core from './core/core.js';
import renderer from './renderer/renderer.js';
import eventizer from './core/eventSystem.js';
import merge from 'deepmerge';
import logger from 'js-logger';

class JSR {
  constructor (input, options = {}) {
    this.logger = logger;
    this.logger.useDefaults();
    this.logger.setLevel(logger.INFO);

    this.modules = {
      eventizer,
      core,
      renderer
    };

    this.moduleOptions = {
      core: {},
      renderer: {},
      eventizer: {}
    };

    const defaults = {};

    this.options = merge(defaults, options);
    this.input = document.querySelector(input);

    if (this.input) {
      this._build(this.modules, this.moduleOptions);
      this._init();
    } else {
      logger.error(`JSR: Invalid 'input' parameter. Couldn't find '${input}' element.`);
    }
  }

  /* Build every module passing other modules and module-specific options as arguments */
  _build (modules, moduleOptions) {
    for (const moduleName in modules) {
      const build = modules[moduleName].build;
      if (build) {
        build({ modules, log: this.logger }, moduleOptions[moduleName]);
        logger.info(`JSR: Module ${moduleName} builded.`);
      } else {
        logger.info(`JSR: Module ${moduleName} skipped. No .build() method.`);
      }
    }
  }

  _init () {
    this.input.style.display = 'none';
    this.modules.core.init({
      values: [0.33, 0.66],
    });
  }
}

new JSR('#range-1');