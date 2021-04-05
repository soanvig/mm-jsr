import { closest } from '@/helpers/closest';
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

  public setClosestRatioValue (valueToSet: number) {
    const values = this.getState().values;

    let closestIndex = closest(valueToSet, values.map(v => v.asRatio()));

    // Handle edge case, in which values are equal. In that case
    // closestIndex would show the second one.
    // But it makes impossible to move it to the left
    // (it is blocked by the first one)
    // So we need to correct index
    if (
      values[closestIndex].asReal() === values[closestIndex - 1]?.asReal()
      && valueToSet < values[closestIndex - 1]?.asRatio()
    ) {
      closestIndex -= 1;
    }

    this.onChange(closestIndex, Value.fromRatio({
      max: this.config.max,
      min: this.config.min,
      ratio: valueToSet,
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

  /**
   * Creates setter, that allows to change value
   * by a offset, relative to value in the moment
   * of creating the setter
   */
  public makeValueRatioOffsetModifier (index: number) {
    const currentValue = this.getState().values[index].asRatio();

    return (offset: number) => {
      this.onChange(index, Value.fromRatio({
        max: this.config.max,
        min: this.config.min,
        ratio: currentValue + offset,
      }));
    };
  }

  public static init (ctor: Ctor) {
    return new InputHandler(ctor);
  }
}