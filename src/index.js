import Core from './modules/Core';
import Renderer from './modules/Renderer';
import Eventizer from './modules/Eventizer';
import Logger from './Logger';
import InputUpdater from './modules/InputUpdater';
import Labels from './modules/Labels';
import TouchSupport from './modules/TouchSupport';
import HtmlLabels from './modules/HtmlLabels';
import Grid from './modules/Grid';
import merge from 'deepmerge';

export default class {
  constructor (inputs, options = {}) {
    const defaults = {
      log: 'error',
      min: 0,
      max: 100,
      step: 1,
      enabled: true,
      limit: {
        show: false
      },
      modules: {},
      modulesArray: [
        Eventizer,
        Core,
        Labels,
        Grid,
        Renderer,
        TouchSupport,
        InputUpdater,
        HtmlLabels
      ]
    };
    this.config = merge(defaults, options);

    this.specificConfig = {
      inputUpdater: {},
      htmlLabels: {}
    };

    this.logger = new Logger;
    this.logger.setLevel(this.config.log);

    // Ensure array and find all inputs
    inputs = [].concat(inputs);
    this.inputs = inputs.map((input) => {
      if (typeof input === 'string') {
        return document.querySelector(input);
      }

      return input;
    });

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

    // Install modules
    this.modules = {};
    this.modulesArray = [];
    this.config.modulesArray.forEach((module, index) => {
      // Keep backward compability, because of semver
      // Setting config.modules to false will disable module
      if (
        typeof this.config.modules[module.name] === 'undefined'
        || this.config.modules[module.name]
      ) {
        this.modulesArray[index] = this.modules[module.name] = new module.Klass;
      }
    });

    this.specificConfig.inputUpdater.inputs = this.inputs;
    this.specificConfig.htmlLabels.inputs = this.inputs;

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
        }, (this.specificConfig[moduleName] || {}));
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
    this.modules.core.init(this.inputs);
  }

  /* API */
  addEventListener (event, callback) {
    const eventNames = {
      'update': 'input/value:update'
    };

    this.modules.eventizer.register(eventNames[event], callback);

    return this;
  }

  setValue (id, value) {
    this.modules.core.setValue(value, id);

    return this;
  }

  setLimit (limit, value) {
    this.modules.core.setLimit(limit, value);

    return this;
  }

  disable () {
    this.config.enabled = false;
    this.modules.renderer.body.root.classList.add('jsr--disabled');

    return this;
  }

  enable () {
    this.config.enabled = true;
    this.modules.renderer.body.root.classList.remove('jsr--disabled');

    return this;
  }

  refresh (config = {}, moduleName = null) {
    this.config = merge(this.config, config, { arrayMerge: (dest, source) => source });

    if (moduleName) {
      if (this.modules[moduleName].refresh) {
        this.modules[moduleName].refresh(this.config);
      }
    } else {
      this.modulesArray.forEach((module) => {
        if (module.refresh) {
          module.refresh(this.config);
        }
      });
    }
  }
}