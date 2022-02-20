import { State, StateDto } from '@/models/State';
import { Changelog, Module } from '@/modules/Module';
import { ConfigDto } from '@/models/Config';

/**
 * Module for limiting values applied via {@link ConfigAttrs.limit}.
 *
 * Uses `.jsr_limit` CSS class.
 */
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

  public update (config: ConfigDto, state: State, changelog: Changelog) {
    const { values } = state;

    // @NOTE this modified all values. Should changelog include these values then??
    const limitedValues = values.map(value => (
      value.clampReal(
        state.limit?.min?.asReal() ?? -Infinity,
        state.limit?.max?.asReal() ?? +Infinity,
      )
    ));

    return state.updateValues(limitedValues);
  }
}