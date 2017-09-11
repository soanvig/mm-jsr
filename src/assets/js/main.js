import core from './core/core.js';
import renderer from './renderer/renderer.js';
import eventizer from './core/eventSystem.js';
import logger from './logger.js';
import merge from 'deepmerge';

class JSR {
  constructor (input, options = {}) {
    this.logger = logger;

    this.modules = {
      eventizer,
      core,
      renderer
    };

    this.moduleOptions = {
      core: {},
      renderer: {},
      eventizer: {},
    };

    const defaults = {
      log: 'error'
    };

    this.options = merge(defaults, options);
    this.input = document.querySelector(input);

    this.logger.setLevel(this.options.log);

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
      values: [50, 120],
    });
  }

  addEventListener (event, callback) {
    const eventNames = {
      'update': 'core/value:update'
    };

    this.modules.eventizer.register(eventNames[event], callback);
  }
  
  setValue (id, value) {
    this.modules.core.setValue(id, value);
  }
}

const jsr = new JSR('#range-1', {
  log: 'info'
});

jsr.addEventListener('update', (slider, value) => {
  console.log(value);
});

jsr.setValue(0, 70);