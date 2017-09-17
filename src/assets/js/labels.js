import { listenOn } from './helpers.js';

function updateLabel (id, real, ratio) {
  const label = this.labels[id];

  // Update value
  label.innerHTML = real;

  // Update position
  const labelRect = label.getBoundingClientRect();
  const width = labelRect.width;

  label.style.left = `calc(${ratio * 100}% - ${width / 2}px)`;

  const rootRect = this.modules.renderer.body.root.getBoundingClientRect();
  const labelNewRect = label.getBoundingClientRect();

  if (labelNewRect.right > rootRect.right) {
    label.style.left = `calc(100% - ${width}px)`;
  }

  if (labelNewRect.left < rootRect.left) {
    label.style.left = '0';
  }
}

export default class {
  constructor () {
    this.labels = [];
  }

  _bindEvents () {
    listenOn(this.labels, 'click', (event) => {
      event.stopPropagation();
    });

    this.modules.eventizer.register('core/value:update', (id, real, ratio) => {
      updateLabel.call(this, id, real, ratio);
    });

    // Delegate this event to renderer slider click
    listenOn(this.labels, 'mousedown', (event) => {
      const clickEvent = new MouseEvent('mousedown', event);
      this.modules.renderer.body.sliders[event.target.dataset.jsrId].dispatchEvent(clickEvent);
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