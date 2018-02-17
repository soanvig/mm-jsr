import debounce from 'debounce';
import merge from 'deepmerge';

class Grid {
  _bindEvents () {
    window.addEventListener('resize',
      debounce(() => {
        this.logger.debug('JSR: Canvas resized.');

        this._setDimensions();
        this._render();
      }, 50)
    );
  }

  _setDimensions () {
    this.width = this.modules.renderer.body.railOuter.offsetWidth;
    this.height = this.config.grid.height + this.config.grid.fontSize + this.config.grid.textPadding;
    this.devicePixelRatio = window.devicePixelRatio || 1;

    this.canvas.style.width = `${this.width}px`;
    this.canvas.width = this.width * this.devicePixelRatio;

    this.canvas.style.height = `${this.height}px`;
    this.canvas.height = this.height * this.devicePixelRatio;

    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  _getNumberOfLines () {
    const number = 100;
    return Math.round(number);
  }

  _render () {
    const width = this.width;
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
      // Draw line
      let left = i * ratio * width;
      left = Math.round(left * 100.0) / 100.0;
      context.moveTo(left, 0);
      context.lineTo(left, height);

      // Draw text
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
    this.context = this.canvas.getContext('2d');

    this.modules.eventizer.register('modules/renderer:rootAppended', () => {
      this.modules.renderer.body.railOuter.appendChild(this.canvas);
      this._setDimensions();
      this._render();
    });

    this._bindEvents();
  }

  refresh (config) {
    this.config = merge(this.config, config, { arrayMerge: (dest, source) => source });

    this._setDimensions();
    this._render();

    this.logger.debug('JSR: grid refreshed');
  }
}

export default {
  name: 'grid',
  Klass: Grid
};