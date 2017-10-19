import { throttle } from './helpers.js';
import merge from 'deepmerge';

export default class {
  _bindEvents () {
    const id = Math.random();
    window.addEventListener('resize', () => {
      throttle(`grid-resize-${id}`, 50, () => {
        this.logger.debug('JSR: Canvas resized.');

        this._setWidth();
        this._render();
      });
    });
  }

  _setWidth () {
    this.canvas.width = this.modules.renderer.body.railOuter.offsetWidth;
  }

  _render () {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const context = this.context;
    const numberOfLines = 100;
    const ratio = 1 / numberOfLines;

    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'rgba(0, 0, 0, 0.3)';

    for (let i = 0; i <= numberOfLines; i += 1) {
      let left = i * ratio * width;
      left = Math.round(left * 100.0) / 100.0;
      context.moveTo(i * ratio * width, 0);
      context.lineTo(i * ratio * width, height);
    }

    context.closePath();
    context.stroke();
  }

  /* API */
  build ({ config, modules, logger }) {
    const defaults = {
      grid: false
    };
    this.logger = logger;
    this.config = merge(defaults, config);
    this.modules = modules;

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('jsr_canvas');
    this.canvas.height = '10';

    this.context = this.canvas.getContext('2d');

    this.modules.eventizer.register('modules/renderer:rootAppended', () => {
      this.modules.renderer.body.railOuter.appendChild(this.canvas);
      this._setWidth();
      this._render();
    });

    this._bindEvents();
  }
}