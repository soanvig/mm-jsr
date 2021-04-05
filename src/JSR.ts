import { Engine } from '@/Engine';
import { ConfigAttrs } from '@/models/Config';

interface Ctor {
  config: ConfigAttrs;
}

export class JSR {
  private engine: Engine;

  public constructor (ctor: Ctor) {
    this.engine = new Engine({
      config: ctor.config,
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

  public destroy () {
    this.engine.modules.forEach(m => m.destroy());
  }
}