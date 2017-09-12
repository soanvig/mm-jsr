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

    const defaults = {
      log: 'error',
      sliders: 2,
      min: 0,
      max: 100,
      step: 1,
      values: [25, 75]
    };
    
    this.config = merge(defaults, options, {
      arrayMerge: (destinationArray, sourceArray) => sourceArray
    });
    this.input = document.querySelector(input);

    this.logger.setLevel(this.config.log);

    if (this.input) {
      this._build(this.modules, this.config);
      this._init();
    } else {
      logger.error(`JSR: Invalid 'input' parameter. Couldn't find '${input}' element.`);
    }
  }

  /* Build every module passing other modules and module-specific options as arguments */
  _build (modules, config) {
    for (const moduleName in modules) {
      const build = modules[moduleName].build;
      if (build) {
        build({ modules, log: this.logger, config });
        logger.info(`JSR: Module ${moduleName} builded.`);
      } else {
        logger.info(`JSR: Module ${moduleName} skipped. No .build() method.`);
      }
    }
  }

  _init () {
    this.input.style.display = 'none';
    this.modules.core.init(this.config.values, this.input);
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

new JSR('#range-1', {
  sliders: 1,
  values: [50],
  log: 'info'
});

new JSR('#range-2', {
  sliders: 2,
  values: [25, 75],
  log: 'info'
});

new JSR('#range-3', {
  sliders: 3,
  values: [25, 50, 75],
  log: 'info'
});

// jsr.addEventListener('update', (slider, value) => {
//   console.log(`Custom events test: New value set: ${slider}/${value}`);
// });

// jsr.setValue(0, 40);