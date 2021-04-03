import { StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { Module } from '@/modules/Module';

export class ModuleGrid extends Module {
  private grid!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  public destroy () {
    this.grid.remove();
  }

  public initView () {
    this.grid = document.createElement('canvas');

    this.grid.classList.add('jsr_grid');

    this.context = this.grid.getContext('2d')!;

    this.renderer.addChild(this.grid);

    this.drawGrid();
  }

  public render (_: StateDto): VoidFunction {
    return () => {};
  }

  private drawGrid () {
    const defaults = {
      color: 'rgba(0, 0, 0, 0.3)',
      height: 10,
      fontSize: 10,
      fontFamily: 'sans-serif',
      textPadding: 5,
    };

    const context = this.context;
    const numberOfLines = 100;
    const ratio = 1 / numberOfLines;

    const pixelRatio = window.devicePixelRatio || 1;
    const canvasWidth = this.grid.offsetWidth * pixelRatio;
    const canvasHeight = (defaults.height + defaults.fontSize + defaults.textPadding) * pixelRatio;

    this.grid.width = canvasWidth;
    this.grid.height = canvasHeight;

    context.scale(pixelRatio, pixelRatio);

    context.clearRect(0, 0, canvasWidth, defaults.height);
    context.beginPath();
    context.lineWidth = 1;
    context.fillStyle = context.strokeStyle = defaults.color;
    context.font = `${defaults.fontSize}px ${defaults.fontFamily}`;
    context.textBaseline = 'top';

    for (let i = 0; i <= numberOfLines; i += 1) {
      // Draw line
      let left = i * ratio * canvasWidth;
      left = Math.round(left * 100.0) / 100.0;
      context.moveTo(left, 0);
      context.lineTo(left, defaults.height);

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

        const text = this.config.formatter(roundedValue.asReal());
        context.fillText(text.toString(), i * ratio * canvasWidth, defaults.height + defaults.textPadding);
      }
    }

    context.closePath();
    context.stroke();
  }
}