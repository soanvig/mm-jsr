import structureParser from './structureParser';
import merge from 'deepmerge';

class Renderer {
  constructor () {
    // This lists all available in-object variables
    this.logger = null;
    this.config = {};
    this.modules = {};
    this.body = {};
    this.bodyStructure = {
      root: {
        classes: ['jsr'],
        count: 1
      }
    };
  }

  _createBody (start) {
    const structure = merge({}, this.bodyStructure);

    for (const moduleName in this.modules) {
      if (!this.modules[moduleName].view) {
        continue;
      }

      const view = this.modules[moduleName].view();
      view.forEach((singleView) => {
        structure[singleView.name] = singleView;
        if (!structure[singleView.parent].children) {
          structure[singleView.parent].children = [];
        }
        structure[singleView.parent].children.push(singleView.name);
      });
    }

    return structureParser(structure, start);
  }

  /* API */
  build ({ modules, logger, config }) {
    this.modules = modules;
    this.logger = logger;
    this.config = config;

    // Create body starting from root
    this.body = this._createBody('root');

    this.modules.eventizer.trigger('modules/renderer:builded');
  }

  // Appends root after target
  // @target should be HTML element
  appendRoot (target) {
    target.parentNode.insertBefore(this.body.root, target.nextSibling);
    this.modules.eventizer.trigger('modules/renderer:rootAppended');
  }
}

export default {
  name: 'renderer',
  Klass: Renderer
};