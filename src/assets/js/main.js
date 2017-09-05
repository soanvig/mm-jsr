import core from './core/core.js';
import renderer from './core/renderer.js';
import eventizer from './core/eventSystem.js';
import merge from 'deepmerge';

class JSR {
  constructor (input, options = {}) {
    this.modules = {
      eventizer,
      core,
      renderer
    }

    this.moduleOptions = {
      core: {},
      renderer: {},
      eventizer: {}
    }

    const defaults = {}

    this.options = merge(defaults, options);
    this.input = document.querySelector(input);

    if (this.input) {
      this._build(this.modules, this.moduleOptions);
      this._init();
    } else {
      console.error(`JSR: Invalid 'input' parameter. Couldn't find '${input}' element.`);
    }
  }

  /* Build every module passing other modules and module-specific options as arguments */
  _build (modules, moduleOptions) {
    for (const moduleName in modules) {
      const build = modules[moduleName].build;
      if (build) {
        build({ modules }, moduleOptions[moduleName]);
        console.info(`JSR: Module ${moduleName} builded.`);
      } else {
        console.warn(`JSR: Module ${moduleName} skipped. No .build() method.`);
      }
    }
  }

  _init () {
    this.input.style.display = 'none';
    this.modules.core.init();
  }
}

new JSR('#range-1');