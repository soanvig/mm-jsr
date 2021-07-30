import { useOnMouse } from '@/events/useOnMouse';
import { neighbourGroup } from '@/helpers/neighbourGroup';
import { range } from '@/helpers/range';
import { times } from '@/helpers/times';
import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

/**
 * Module showing bar between values.
 * - does not require Sliders to be enabled.
 * - bar is moveable horizontally, allowing to move neighbouring values simultaneously.
 * - bar is clickable, allowing for standard behavior.
 *
 * Uses `.jsr_bar` CSS class.
 */
export class ModuleBar extends Module {
  private bars: HTMLElement[] = [];

  public destroy () {
    this.bars.forEach(s => s.remove());
  }

  public initView () {
    this.bars = times(this.config.valuesCount - 1, index => {
      const bar = document.createElement('div');
      bar.classList.add('jsr_bar');
      bar.dataset.key = (index - 1).toString();
      bar.style.left = '0';
      bar.style.width = '0';

      this.addMoveHandler(bar, index - 1);

      return bar;
    });

    this.bars.forEach(slider => this.renderer.addChild(slider));
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      neighbourGroup(range(state.values.length - 1)).map(([from, to]) => {
        const left = state.values[from].asRatio() * 100;
        const width = (state.values[to].asRatio() - state.values[from].asRatio()) * 100;
        this.bars[from].style.left = `${left}%`;
        this.bars[from].style.width = `${width}%`;
      });
    };
  }

  private addMoveHandler (bar: HTMLElement, index: number) {
    let setOffsetRatioLeft = (() => {}) as (o: number) => void;
    let setOffsetRatioRight = (() => {}) as (o: number) => void;
    let startX: number = 0;
    let isMoved: boolean = false;

    useOnMouse(bar, {
      onMouseDown: e => {
        setOffsetRatioLeft = this.input.makeValueRatioOffsetModifier(index);
        setOffsetRatioRight = this.input.makeValueRatioOffsetModifier(index + 1);
        startX = e.clientX;
      },
      onMouseMove: e => {
        isMoved = true;

        const ratioDistance = this.renderer.distanceToRelative(e.clientX - startX);

        setOffsetRatioLeft(ratioDistance);
        setOffsetRatioRight(ratioDistance);
      },
      onMouseUp: () => {
        if (!isMoved) {
          this.input.setClosestRatioValue(this.renderer.positionToRelative(startX));
        }

        setOffsetRatioLeft = () => {};
        setOffsetRatioRight = () => {};
        startX = 0;
        isMoved = false;
      },
    });
  }
}