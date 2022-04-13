import { State, StateDto } from '@/models/State';
import { Changelog, Module } from '@/modules/Module';
import { ConfigDto } from '@/models/Config';
import { assert, isNumber, isPlainObject } from '@/validation/assert';

export interface ModuleLimitSettings {
  min?: number;
  max?: number;
}

export type ChangeLimitCommand = { min?: number, max?: number };

/**
 * Module for limiting values.
 * This module has to be first in the list of modules, because otherwise limit won't properly.
 *
 * Uses `.jsr_limit` CSS class.
 */
export class ModuleLimit extends Module {
  private limit!: HTMLElement;
  private settings!: ModuleLimitSettings;

  constructor (settings: ModuleLimitSettings = {}) {
    super();

    this.changeLimit(settings);
  }

  public destroy () {
    this.limit.remove();
  }

  /**
   * Dynamically change limit.
   *
   * @param command - limit object, that should be applied as new limit
   */
  public changeLimit (command: ChangeLimitCommand) {
    assert('limit object', command, isPlainObject);

    if (command.min) {
      assert('limit.min', command.min, isNumber);
    }

    if (command.max) {
      assert('limit.max', command.max, isNumber);
    }

    this.settings = command;
  }

  public initView () {
    this.limit = document.createElement('div');

    this.limit.classList.add('jsr_limit');

    this.renderer.addChild(this.limit);
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      if (this.settings.min === undefined && this.settings.max === undefined) {
        this.limit.style.left = '0%';
        this.limit.style.right = '0%';
        return;
      }

      const toValue = (num: number) => state.values[0].changeReal(num);

      if (this.settings.min !== undefined) {
        this.limit.style.left = `${toValue(this.settings.min).asRatio() * 100}%`;
      } else {
        this.limit.style.left = '0%';
      }

      if (this.settings.max !== undefined) {
        this.limit.style.right = `calc(100% - ${toValue(this.settings.max).asRatio() * 100}%)`;
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
        this.settings.min ?? -Infinity,
        this.settings.max ?? +Infinity,
      )
    ));

    return state.updateValues(limitedValues);
  }
}