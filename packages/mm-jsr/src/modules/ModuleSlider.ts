import { useOnMove } from '@/events/useOnMove';
import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

/**
 * Module showing points (shape depends on CSS) where values should be.
 * - draggable
 * - adds keyboard support
 *
 * Uses `.jsr_slider` CSS class for each slider. Additional styles may be applied for `.jsr_slider:focus`
 */
export class ModuleSlider extends Module {
  private sliders: HTMLElement[] = [];
  private destroyEvents: VoidFunction[] = [];

  public destroy () {
    this.sliders.forEach(s => s.remove());
    this.destroyEvents.forEach(f => f());
  }

  public initView () {
    this.sliders = this.config.initialValues.map((_, index) => {
      const slider = document.createElement('div');
      slider.classList.add('jsr_slider');
      slider.style.left = '0';
      slider.dataset.key = index.toString();
      slider.tabIndex = 1;

      useOnMove(slider, x => this.handleMove(index, x), this.renderer.getContainer());

      return slider;
    });

    this.sliders.forEach(slider => this.renderer.addChild(slider));

    // apply keyboard support
    const handleKeyboard = (event: KeyboardEvent) => this.handleKeyboard(event);
    this.config.container.addEventListener('keydown', handleKeyboard);
    this.destroyEvents.push(() => this.config.container.removeEventListener('keydown', handleKeyboard));
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      state.values.forEach((value, i) => {
        this.sliders[i].style.left = `${value.asRatio() * 100}%`;
      });
    };
  }

  private handleMove (index: number, x: number) {
    this.input.setRatioValue(index, this.renderer.positionToRelative(x));
  }

  private handleKeyboard (event: KeyboardEvent) {
    const target = event.target;

    if (target && isEventTargetSlider(target)) {
      const index = Number(target.dataset.key!);

      const direction = keyDirectionMap.get(event.code);

      if (direction) {
        event.preventDefault();

        if (event.shiftKey) {
          this.handleKeyboardWithShift(index, direction);
        } else if (event.ctrlKey) {
          this.handleKeyboardWithCtrl(index, direction);
        } else {
          this.handleKeyboardPlain(index, direction);
        }
      }
    }
  }

  private handleKeyboardWithShift (index: number, direction: number) {
    this.input.changeRatioBy(index, 0.05 * direction);
  }

  private handleKeyboardWithCtrl (index: number, direction: number) {
    this.input.changeRealBy(index, this.config.step * 10 * direction);
  }

  private handleKeyboardPlain (index: number, direction: number) {
    this.input.changeRealBy(index, this.config.step * direction);
  }
}

const keyDirectionMap = new Map([
  ['ArrowLeft', -1],
  ['ArrowUp', +1],
  ['ArrowRight', +1],
  ['ArrowDown', -1],
]);


const isEventTargetSlider = (target: EventTarget): target is HTMLElement => {
  return (target as any).classList?.contains('jsr_slider') ?? false;
};
