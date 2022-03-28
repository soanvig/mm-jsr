import { Engine, ValueChangeHandler } from '@/Engine';
import { ConfigAttrs } from '@/models/Config';
import { Module } from '@/modules/Module';
import { ModuleBar } from '@/modules/ModuleBar';
import { ModuleGrid } from '@/modules/ModuleGrid';
import { ModuleLabel } from '@/modules/ModuleLabel';
import { ModuleLimit } from '@/modules/ModuleLimit';
import { ModuleNeighourLimit } from '@/modules/ModuleNeighbourLimit';
import { ModuleRail } from '@/modules/ModuleRail';
import { ModuleRound } from '@/modules/ModuleRound';
import { ModuleSlider } from '@/modules/ModuleSlider';
import { assert, isArray, isInstanceOf, isNumber, isPlainObject } from '@/validation/assert';

export interface JsrConstructor {
  /** Configuration */
  config: ConfigAttrs;

  /** List of modules to use - without them, JSR shows nothing in HTML, but is still usable via API */
  modules: Module[];
}

export type ChangeLimitCommand = { min?: number; max?: number; }

export class JSR {
  private engine: Engine;

  public constructor (ctor: JsrConstructor) {
    assert('JSR.modules', ctor.modules, isArray(isInstanceOf(Module)));

    const modules = removeDuplicatedModules([
      new ModuleLimit(),
      new ModuleNeighourLimit(),
      new ModuleRound(),
      ...ctor.modules,
    ]);

    this.engine = new Engine({
      config: ctor.config,
      modules,
    });
  }

  /**
   * Set `index` value (real).
   *
   * @param index - index of value to set
   * @param value - real value to set
   */
  public setRealValue (index: number, value: number): void {
    this.engine.inputHandler.setRealValue(index, value);
  }

  /**
   * Set `index` value (ratio).
   *
   * @param index - index of value to set
   * @param value - ratio value to set
   */
  public setRatioValue (index: number, value: number): void {
    this.engine.inputHandler.setRatioValue(index, value);
  }

  /**
   * Get `index` value (real).
   *
   * @param index - index of value to get
   * @returns - real value
   */
  public getRealValue (index: number): number {
    return this.engine.stateProcessor.getState().values[index].asReal();
  }

  /**
   * Get `index` value (ratio).
   *
   * @param index - index of value to get
   * @returns - ratio value
   */
  public getRatioValue (index: number): number {
    return this.engine.stateProcessor.getState().values[index].asRatio();
  }

  /**
   * Add handler listening of any value change.
   *
   * @param handler - handler listening for value change
   * @returns - returns function that allows to remove handler
   */
  public onValueChange (handler: ValueChangeHandler): VoidFunction {
    return this.engine.addValueChangeHandler(handler);
  }

  /**
   * Dynamically change limit.
   *
   * @param command - limit object, that should be applied as new limit
   */
  public changeLimit (command: ChangeLimitCommand): void {
    assert('limit object', command, isPlainObject);

    if (command.min) {
      assert('limit.min', command.min, isNumber);
    }

    if (command.max) {
      assert('limit.max', command.max, isNumber);
    }

    this.engine.changeLimit({
      min: command.min !== undefined ? this.engine.produceRealValue(command.min) : undefined,
      max: command.max !== undefined ? this.engine.produceRealValue(command.max) : undefined,
    });
  }

  /**
   * Enable JSR by allowing value changes, and removing `.is-disabled` class from the container.
   */
  public enable (): void {
    this.engine.enable();
  }

  /**
   * Disable JSR by disallowing value changes, and adding `.is-disabled` class to the container.
   */
  public disable (): void {
    this.engine.disable();
  }

  /**
   * Return whether JSR is enabled or disabled.
   */
  public isEnabled (): boolean {
    return this.engine.isEnabled();
  }

  /**
   * Destroy JSR instance, removing all HTML elements (besides container) and event listeners.
   *
   * @NOTE this function does not remove the instance of JSR itself, therefore
   * it does not remove handler already added to JSR, but one can simple forget about this instance,
   * and let garbage-collector to collect it.
   *
   * It does not removes original container element.
   */
  public destroy (): void {
    this.engine.modules.forEach(m => m.destroy && m.destroy());
  }

  /** Base module used for creating user's own modules */
  public static Module = Module;

  /** Bar module */
  public static Bar = ModuleBar;

  /** Grid module */
  public static Grid = ModuleGrid;

  /** Label module */
  public static Label = ModuleLabel;

  /** Limit module */
  public static Limit = ModuleLimit;

  /** Rail module */
  public static Rail = ModuleRail;

  /** Slider module */
  public static Slider = ModuleSlider;
}

const removeDuplicatedModules = (modules: Module[]): Module[] =>
  modules.filter((m1, i1) => !modules.some((m2, i2) => m1.constructor === m2.constructor && i2 < i1));
