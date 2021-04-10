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

export type ChangeLimitCommand = { min?: number; max?: number; }

export class JSR {
  private engine: Engine;

  public constructor (ctor: Ctor) {
    assert('JSR.modules', ctor.modules, isArray(isInstanceOf(Module)));

    this.engine = new Engine({
      config: ctor.config,
      modules: ctor.modules,
    });
  }

  public setRealValue (index: number, value: number) {
    this.engine.inputHandler.setRealValue(index, value);
  }

  public setRatioValue (index: number, value: number) {
    this.engine.inputHandler.setRatioValue(index, value);
  }

  public getRealValue (index: number) {
    return this.engine.stateProcessor.getState().values[index].asReal();
  }

  public getRatioValue (index: number) {
    return this.engine.stateProcessor.getState().values[index].asRatio();
  }

  public onValueChange (handler: ValueChangeHandler) {
    this.engine.addValueChangeHandler(handler);
  }

  public changeLimit (command: ChangeLimitCommand) {
    assert('limit object', command, isPlainObject);

    if (command.min) {
      assert('limit.min', command.min, isNumber);
    }

    if (command.max) {
      assert('limit.max', command.max, isNumber);
    }

    this.engine.stateProcessor.changeLimit({
      min: command.min !== undefined ? this.engine.produceRealValue(command.min) : undefined,
      max: command.max !== undefined ? this.engine.produceRealValue(command.max) : undefined,
    });
  }

  public enable () {
    this.engine.enable();
  }

  public disable () {
    this.engine.disable();
  }

  public destroy () {
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