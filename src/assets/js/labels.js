import { listenOn } from './helpers.js';

function updateLabel (id, real, ratio) {
  // Update position
  this.labels[id].style.left = `${ratio * 100}%`;
  
  // Update value
  this.labels[id].innerHTML = real;
}

export default class {
  constructor () {
    this.labels = [];
  }

  _bindEvents () {
    listenOn(this.labels, 'click', () => {
      console.log('label clicked');
    });

    this.modules.eventizer.register('core/value:update', (id, real, ratio) => {
      updateLabel.call(this, id, real, ratio);
    });
  }
  
  build ({ config, modules, logger }) {
    this.logger = logger;
    this.config = config;
    this.modules = modules;

    this.modules.renderer.structure.labels = {
      classes: ['jsr_label'],
      children: [],
      count: this.config.sliders,
      alwaysArray: true
    };

    this.modules.renderer.structure.rail.children.push('labels');

    this.modules.eventizer.register('modules/renderer:builded', () => {
      this.labels = this.modules.renderer.body.labels;
      this._bindEvents();
    });
  }
} 