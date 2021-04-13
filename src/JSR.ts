import { Engine, ValueChangeHandler } from '@/Engine';
import { ConfigAttrs } from '@/models/Config';
import { Module } from '@/modules/Module';
import { ModuleBar } from '@/modules/ModuleBar';
import { ModuleGrid } from '@/modules/ModuleGrid';
import { ModuleLabel } from '@/modules/ModuleLabel';
import { ModuleLimit } from '@/modules/ModuleLimit';
import { ModuleRail } from '@/modules/ModuleRail';
import { ModuleSlider } from '@/modules/ModuleSlider';
import { assert, isArray, isInstanceOf, isNumber, isPlainObject } from '@/validation/assert';

interface Ctor {
  config: ConfigAttrs;
  modules: Module[];
}

type ChangeLimitCommand = { min?: number; max?: number; }

export class JSR {
  private engine: Engine;

  public constructor (ctor: Ctor) {
    assert('JSR.modules', ctor.modules, isArray(isInstanceOf(Module)));

    this.engine = new Engine({
      config: ctor.config,
      modules: ctor.modules,
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
   */
  public onValueChange (handler: ValueChangeHandler) {
    this.engine.addValueChangeHandler(handler);
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
   */
  public destroy (): void {
    this.engine.modules.forEach(m => m.destroy());
  }

  public static Module = Module;
  public static Bar = ModuleBar;
  public static Grid = ModuleGrid;
  public static Label = ModuleLabel;
  public static Limit = ModuleLimit;
  public static Rail = ModuleRail;
  public static Slider = ModuleSlider;
}