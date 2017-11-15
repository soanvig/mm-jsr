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

  _getNumberOfLines () {
    const number = 100;
    return Math.round(number);  
  }

  _render () {
    const width = this.canvas.width;
    const height = this.config.grid.height;
    const context = this.context;
    const numberOfLines = this._getNumberOfLines();
    const ratio = 1 / numberOfLines;

    context.clearRect(0, 0, width, height);
    context.beginPath();
    context.lineWidth = 1;
    context.fillStyle = context.strokeStyle = this.config.grid.color;
    context.font = `${this.config.grid.fontSize}px ${this.config.grid.fontFamily}`;
    context.textBaseline = 'top';

    for (let i = 0; i <= numberOfLines; i += 1) {
      let left = i * ratio * width;
      left = Math.round(left * 100.0) / 100.0;
      context.moveTo(i * ratio * width, 0);
      context.lineTo(i * ratio * width, height);
      if (i % 10 === 0) {
        // Determine the position of text
        if (i === 0) {
          context.textAlign = 'left';
        } else if (i === numberOfLines) {
          context.textAlign = 'right';
        } else {
          context.textAlign = 'center';
        }

        let text = (this.config.max - this.config.min) * (i / numberOfLines) + this.config.min;
        if (this.config.labels && this.config.labels.formatter) {
          text = this.config.labels.formatter(text);
        }
        context.fillText(text.toString(), i * ratio * width, height + this.config.grid.textPadding);
      }
    }

    context.closePath();
    context.stroke();
  }

  /* API */
  build ({ config, modules, logger }) {
    const defaults = {
      grid: {
        color: 'rgba(0, 0, 0, 0.3)',
        height: 10,
        fontSize: 10,
        fontFamily: 'sans-serif',
        textPadding: 5
      }
    };
    this.logger = logger;
    this.config = merge(defaults, config);
    this.modules = modules;

    this.canvas = document.createElement('canvas');
    this.canvas.classList.add('jsr_canvas');
    this.canvas.height = this.config.grid.height + this.config.grid.fontSize + this.config.grid.textPadding;

    this.context = this.canvas.getContext('2d');

    this.modules.eventizer.register('modules/renderer:rootAppended', () => {
      this.modules.renderer.body.railOuter.appendChild(this.canvas);
      this._setWidth();
      this._render();
    });

    this._bindEvents();
  }
}