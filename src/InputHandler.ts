import { ConfigDto } from '@/models/Config';
import { StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { StateProcessor } from '@/StateProcessor';

interface Ctor {
  config: ConfigDto;
  getState: () => StateDto;
  onChange: (index: number, value: Value) => void;
}

export class InputHandler {
  private config: ConfigDto;
  private onChange: (index: number, value: Value) => void;
  private getState: () => StateDto;

  private constructor (ctor: Ctor) {
    this.config = ctor.config;
    this.onChange = ctor.onChange;
    this.getState = ctor.getState;
  }

  public setRealValue (index: number, value: number) {
    this.onChange(index, Value.fromReal({
      max: this.config.max,
      min: this.config.min,
      real: value,
    }));
  }

  public setRatioValue (index: number, value: number) {
    this.onChange(index, Value.fromRatio({
      max: this.config.max,
      min: this.config.min,
      ratio: value,
    }));
  }

  public changeRatioBy (index: number, value: number) {
    const currentValue = this.getState().values[index];
    this.onChange(index, Value.fromRatio({
      max: this.config.max,
      min: this.config.min,
      ratio: currentValue.asRatio() + value,
    }));
  }

  public changeRealBy (index: number, value: number) {
    const currentValue = this.getState().values[index];
    this.onChange(index, Value.fromReal({
      max: this.config.max,
      min: this.config.min,
      real: currentValue.asReal() + value,
    }));
  }

  public static init (ctor: Ctor) {
    return new InputHandler(ctor);
  }
}