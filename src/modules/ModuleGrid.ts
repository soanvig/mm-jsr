import { debounce } from '@/helpers/debounce';
import { StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { Module } from '@/modules/Module';
import { assert, isFunction, isNumber, isString } from '@/validation/assert';

interface Settings {
  color: string;
  height: number;
  fontSize: number;
  fontFamily: string;
  textPadding: number;
  formatter: (realValue: number) => string;
}

export class ModuleGrid extends Module {
  private grid!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private settings: Settings;

  constructor (settings: Partial<Settings> = {}) {
    super();

    this.assertSettings(settings);

    this.settings = Object.assign({
      color: 'rgba(0, 0, 0, 0.3)',
      height: 10,
      fontSize: 10,
      fontFamily: 'sans-serif',
      textPadding: 5,
      formatter: String,
    }, settings);
  }

  public destroy () {
    this.grid.remove();

    window.removeEventListener('resize', this.handleWindowResize);
  }

  public initView () {
    this.grid = document.createElement('canvas');

    this.grid.classList.add('jsr_grid');

    this.context = this.grid.getContext('2d')!;

    this.renderer.addChild(this.grid);

    this.drawGrid();

    window.addEventListener('resize', this.handleWindowResize);

    this.grid.addEventListener('click', this.handleClick);
  }

  public render (_: StateDto): VoidFunction {
    return () => {};
  }

  private drawGrid () {
    const width = this.renderer.getContainer().offsetWidth;
    const height = this.settings.height + this.settings.fontSize + this.settings.textPadding;
    const pixelRatio = window.devicePixelRatio || 1;

    const context = this.context;
    const numberOfLines = 100;
    const ratio = 1 / numberOfLines;

    this.grid.style.width = `${width}px`;
    this.grid.width = width * pixelRatio;
    this.grid.style.height = `${height}px`;
    this.grid.height = height * pixelRatio;

    context.scale(pixelRatio, pixelRatio);
    context.clearRect(0, 0, width, this.settings.height);
    context.beginPath();
    context.lineWidth = 1;
    context.fillStyle = context.strokeStyle = this.settings.color;
    context.font = `${this.settings.fontSize}px ${this.settings.fontFamily}`;
    context.textBaseline = 'top';

    for (let i = 0; i <= numberOfLines; i += 1) {
      // Draw line
      let left = i * ratio * width;
      left = Math.round(left * 100.0) / 100.0;
      context.moveTo(left, 0);
      context.lineTo(left, this.settings.height);

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

        const value = Value.fromRatio({
          ratio: i / numberOfLines,
          max: this.config.max,
          min: this.config.min,
        });

        const roundedValue = value.changeReal(Math.round(value.asReal() / this.config.step) * this.config.step);

        const text = this.settings.formatter(roundedValue.asReal());
        context.fillText(text.toString(), i * ratio * width, this.settings.height + this.settings.textPadding);
      }
    }

    context.closePath();
    context.stroke();
  }

  private handleWindowResize = debounce(() => {
    this.drawGrid();
  }, 50);

  private handleClick = (e: MouseEvent) => {
    this.input.setClosestRatioValue(this.renderer.positionToRelative(e.clientX));
  }

  private assertSettings (settings: Partial<Settings>) {
    settings.formatter && assert('Grid.formatter', settings.formatter, isFunction);
    settings.color && assert('Grid.color', settings.color, isString);
    settings.height && assert('Grid.height', settings.height, isNumber);
    settings.fontSize && assert('Grid.fontSize', settings.fontSize, isNumber);
    settings.fontFamily && assert('Grid.fontFamily', settings.fontFamily, isString);
    settings.textPadding && assert('Grid.textPadding', settings.textPadding, isNumber);
  }
}
