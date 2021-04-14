import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

export class ModuleLimit extends Module {
  private limit!: HTMLElement;

  public destroy () {
    this.limit.remove();
  }

  public initView () {
    this.limit = document.createElement('div');

    this.limit.classList.add('jsr_limit');

    this.renderer.addChild(this.limit);
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      if (!state.limit?.min && !state.limit?.max) {
        this.limit.style.left = '0%';
        this.limit.style.right = '0%';
        return;
      }

      if (state.limit?.min) {
        this.limit.style.left = `${state.limit.min.asRatio() * 100}%`;
      } else {
        this.limit.style.left = '0%';
      }

      if (state.limit?.max) {
        this.limit.style.right = `calc(100% - ${state.limit.max.asRatio() * 100}%)`;
      } else {
        this.limit.style.right = '0%';
      }
    };
  }
}