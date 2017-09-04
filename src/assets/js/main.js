import core from './core/core.js';
import renderer from './core/renderer.js';
import eventizer from './core/eventSystem.js';
import 'deepmerge';

class JSR {
  constructor (options = {}) {
    this.modules = {
      core,
      renderer,
      eventizer
    }

    this._build(this.modules);
  }

  /* Build every module passing other modules as argument */
  _build (modules) {
    for (const moduleName in modules) {
      const build = modules[moduleName].build;
      if (build) {
        build({ modules });
      }
    }
  }
}

new JSR ();