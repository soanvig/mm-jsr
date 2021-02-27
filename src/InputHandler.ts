import { ConfigDto } from '@/models/Config';
import { Value } from '@/models/Value';
import { StateProcessor } from '@/StateProcessor';

interface Ctor {
  config: ConfigDto;
  onChange: (index: number, value: Value) => void;
}

export class InputHandler {
  private config: ConfigDto;
  private onChange: (index: number, value: Value) => void;

  private constructor (ctor: Ctor) {
    this.config = ctor.config;
    this.onChange = ctor.onChange;
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

  public static init (ctor: Ctor) {
    return new InputHandler(ctor);
  }
}