import Core from './core/core.js';
import Renderer from './renderer/renderer.js';
import Eventizer from './core/eventSystem.js';
import Logger from './logger.js';
import InputUpdater from './inputUpdater.js';
import Labels from './labels.js';
import merge from 'deepmerge';

class JSR {
  constructor (input, options = {}) {
    const defaults = {
      log: 'error',
      sliders: 2,
      min: 0,
      max: 100,
      step: 1,
      values: [25, 75],
      modules: {
        eventizer: Eventizer,
        core: Core,
        labels: Labels,
        renderer: Renderer,
        inputUpdater: InputUpdater,
      }
    };
    this.config = merge(defaults, options, {
      // This will overwrite arrays, instead merging them.
      arrayMerge: (destinationArray, sourceArray) => sourceArray
    });
    this.specificConfig = {
      eventizer: {},
      core: {},
      labels: {},
      renderer: {},
      inputUpdater: {}
    };
    
    // Create modules
    this.modules = {};
    for (const moduleName in this.config.modules) {
      this.modules[moduleName] = new this.config.modules[moduleName];
    }

    this.logger = new Logger;
    this.logger.setLevel(this.config.log);

    this.input = document.querySelector(input);
    this.specificConfig.inputUpdater.input = this.input;

    if (this.input) {
      this._buildModules();
      this._init();
    } else {
      logger.error(`JSR: Invalid 'input' parameter. Couldn't find '${input}' element.`);
    }
  }

  /* Builds every module */
  _buildModules () {
    for (const moduleName in this.modules) {
      const build = this.modules[moduleName].build;
      if (build) {
        build.call(this.modules[moduleName], {
          modules: this.modules,
          logger: this.logger,
          config: this.config
        }, this.specificConfig[moduleName]);
        this.logger.info(`JSR: Module ${moduleName} builded.`);
      } else {
        this.logger.info(`JSR: Module ${moduleName} skipped. No .build() method.`);
      }
    }
  }

  _init () {
    this.input.style.display = 'none';
    this.modules.core.init(this.input, this.config.values);
  }

  /* API */
  addEventListener (event, callback) {
    const eventNames = {
      'update': 'input/value:update'
    };

    this.modules.eventizer.register(eventNames[event], callback);
  }
  
  setValue (id, value) {
    this.modules.core.setValue(id, value);
  }
}

new JSR('#range-1', {
  sliders: 3,
  values: [25, 50, 75],
  log: 'info'
});

new JSR('#range-2', {
  sliders: 2,
  min: 10000,
  max: 20000,
  values: [15000, 17500],
  log: 'info'
});

new JSR('#range-3', {
  sliders: 1,
  step: 0.1,
  values: [50],
  log: 'info'
});

// jsr.addEventListener('update', (slider, value) => {
//   console.log(`Custom events test: New value set: ${slider}/${value}`);
// });

// jsr.setValue(0, 40);