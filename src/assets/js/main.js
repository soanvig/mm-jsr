import Core from './core/core.js';
import Renderer from './renderer/renderer.js';
import Eventizer from './core/eventSystem.js';
import Logger from './logger.js';
import InputUpdater from './inputUpdater.js';
import Labels from './labels.js';
import TouchSupport from './touchSupport.js';
import merge from 'deepmerge';

class JSR {
  constructor (inputs, options = {}) {
    const defaults = {
      log: 'error',
      sliders: 2,
      min: 0,
      max: 100,
      step: 1,
      values: [25, 75],
      labels: {
        affixes: {
          prefix: '',
          suffix: ''
        },
        minMax: true
      },
      modules: {
        eventizer: Eventizer,
        core: Core,
        labels: Labels,
        touchSupport: TouchSupport,
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
      inputUpdater: {},
      touchSupport: {}
    };

    this.logger = new Logger;
    this.logger.setLevel(this.config.log);

    // Ensure array and find all inputs
    inputs = [].concat(inputs);
    this.inputs = inputs.map((input) => document.querySelector(input));

    // Validate config and inputs
    // If any errors
    const errors = this._validate({ inputs });
    if (errors) {
      errors.forEach((error) => {
        this.logger.error(error);
      });

      // Exit script
      return {};
    }
    
    // Create modules
    this.modules = {};
    for (const moduleName in this.config.modules) {
      this.modules[moduleName] = new this.config.modules[moduleName];
    }

    this.specificConfig.inputUpdater.inputs = this.inputs;

    this._buildModules();
    this._init();
  }

  /* Validate everything */
  _validate (data) {
    const errors = [];

    if (this.config.sliders !== this.config.values.length) {
      errors.push(`JSR: Number of sliders isn't equal to number of values.`);
    }

    if (this.inputs.length !== this.config.values.length) {
      errors.push(`JSR: Number of inputs isn't equal to number of values.`);
    }

    // Report not found inputs
    this.inputs.forEach((input, index) => {
      if (!input) {
        errors.push(`JSR: Input ${data.inputs[index]} not found.`);
      }
    });

    if (errors.length) {
      return errors;
    }

    return false;
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
    this.inputs.forEach((input) => {
      input.style.display = 'none';
    });
    this.modules.core.init(this.inputs, this.config.values);
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

new JSR(['#range-1-1', '#range-1-2', '#range-1-3'], {
  sliders: 3,
  values: [25, 50, 75],
  labels: {
    minMax: false
  },
  log: 'info'
});

new JSR(['#range-2-1', '#range-2-2'], {
  sliders: 2,
  min: 10000,
  max: 20000,
  values: [15000, 17500],
  labels: {
    affixes: {
      prefix: '$ '
    },
  },
  log: 'info'
});

new JSR('#range-3', {
  sliders: 1,
  step: 0.1,
  values: [50],
  labels: {
    affixes: {
      suffix: ' PLN'
    },
  },
  log: 'info'
});

new JSR(['#range-4-1', '#range-4-2'], {
  sliders: 2,
  step: 0.1,
  min: -200,
  max: 100,
  values: [50, 75],
  log: 'info'
});

// jsr.addEventListener('update', (slider, value) => {
//   console.log(`Custom events test: New value set: ${slider}/${value}`);
// });

// jsr.setValue(0, 40);