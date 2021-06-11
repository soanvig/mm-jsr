import { debounce } from '@/helpers/debounce';
import { StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { Module } from '@/modules/Module';
import { assert, isFunction, isNumber, isString } from '@/validation/assert';

export interface ModuleGridGetLinesCountParams {
  /** Width of the container */
  containerWidth: number;
}

export interface ModuleGridShouldShowLabelParams {
  /** Line number currently displayed */
  i: number;

  /** Number of all lines */
  linesCount: number;
}

export interface ModuleGridSettings {
  /** Color of grid text and lines. Can be any CSS valid color string */
  color: string;

  /** Height of grid lines (in pixels, no unit) */
  height: number;

  /** Font size of grid text (in pixels, no unit) */
  fontSize: number;

  /** Font family of grid text (should be supported by the browser) */
  fontFamily: string;

  /** Vertical distance between text and lines (in pixels, no unit) */
  textPadding: number;

  /** Formatter used to format values before rendering them as text */
  formatter: (realValue: number) => string;

  /** Returns count of lines, that should be rendered for grid */
  getLinesCount: (opt: ModuleGridGetLinesCountParams) => number;

  /** Function that determines whether line label should be drawn or not */
  shouldShowLabel: (params: ModuleGridShouldShowLabelParams) => boolean;
}

/**
 * Module showing grid (by default beneath rail) giving overview
 * what values are where.
 * - clickable
 * - uses canvas for rendering, to not pollute DOM
 *
 * Uses `.jsr_grid` as grid parent CSS class.
 */
export class ModuleGrid extends Module {
  private grid!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;
  private settings: ModuleGridSettings;

  constructor (settings: Partial<ModuleGridSettings> = {}) {
    super();

    this.assertSettings(settings);

    this.settings = Object.assign({
      color: 'rgba(0, 0, 0, 0.3)',
      height: 10,
      fontSize: 10,
      fontFamily: 'sans-serif',
      textPadding: 5,
      formatter: String,
      getLinesCount: ({ containerWidth }) => Math.min(
        100,
        Math.floor(containerWidth / 10),
      ),
      shouldShowLabel: ({ i, linesCount }) => {
        return i === 0 || i === linesCount || i % 10 === 0;
      },
    } as ModuleGridSettings, settings);
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
    const linesCount = this.settings.getLinesCount({
      containerWidth: width,
    });
    const ratio = 1 / linesCount;

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

    for (let i = 0; i <= linesCount; i += 1) {
      // Draw line
      let left = i * ratio * width;
      left = Math.round(left * 100.0) / 100.0;
      context.moveTo(left, 0);
      context.lineTo(left, this.settings.height);

      const shouldShowLabel = this.settings.shouldShowLabel({
        i,
        linesCount,
      });

      // Draw text
      if (shouldShowLabel) {
        // Determine the position of text
        if (i === 0) {
          context.textAlign = 'left';
        } else if (i === linesCount) {
          context.textAlign = 'right';
        } else {
          context.textAlign = 'center';
        }

        const value = Value.fromRatio({
          ratio: i / linesCount,
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

  private assertSettings (settings: Partial<ModuleGridSettings>) {
    settings.formatter && assert('Grid.formatter', settings.formatter, isFunction);
    settings.color && assert('Grid.color', settings.color, isString);
    settings.height && assert('Grid.height', settings.height, isNumber);
    settings.fontSize && assert('Grid.fontSize', settings.fontSize, isNumber);
    settings.fontFamily && assert('Grid.fontFamily', settings.fontFamily, isString);
    settings.textPadding && assert('Grid.textPadding', settings.textPadding, isNumber);
  }
}
