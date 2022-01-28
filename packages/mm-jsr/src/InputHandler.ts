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

/**
 * InputHandler is class responsible for manipulating values.
 * Any values, that are modified in the system, should be modified
 * through the InputHandler.
 */
export class InputHandler {
  private config: ConfigDto;
  private onChange: (index: number, value: Value, options?: unknown) => void;
  private getState: () => StateDto;

  private constructor (ctor: Ctor) {
    this.config = ctor.config;
    this.onChange = ctor.onChange;
    this.getState = ctor.getState;
  }

  /**
   * Set real value of value at given index.
   */
  public setRealValue (index: number, value: number, options: unknown) {
    this.onChange(index, Value.fromReal({
      max: this.config.max,
      min: this.config.min,
      real: value,
    }), options);
  }

  /**
   * Set ratio value of value at given index.
   */
  public setRatioValue (index: number, value: number, options: unknown) {
    this.onChange(index, Value.fromRatio({
      max: this.config.max,
      min: this.config.min,
      ratio: value,
    }), options);
  }

  /**
   * Set ratio value of value closest to the value, that is being set.
   * 
   * @example
   * For values [0, 100] if we want to set value 30, the closest value to 30 is 0
   * at index 0. Therefore after this operation we will have values [30, 100]
   */
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

  /**
   * Change ratio value as given index by given ratio value.
   * 
   * @example
   * newValue = oldValue + value
   */
  public changeRatioBy (index: number, value: number) {
    const currentValue = this.getState().values[index];

    this.onChange(index, Value.fromRatio({
      max: this.config.max,
      min: this.config.min,
      ratio: currentValue.asRatio() + value,
    }));
  }

  /**
   * Change real value as given index by given real value.
   * 
   * @example
   * newValue = oldValue + value
   */
  public changeRealBy (index: number, value: number) {
    const currentValue = this.getState().values[index];
    this.onChange(index, Value.fromReal({
      max: this.config.max,
      min: this.config.min,
      real: currentValue.asReal() + value,
    }));
  }

  /**
   * Create setter, that allows to change value
   * by a offset, relative to value in the moment
   * of creating the setter.
   * 
   * It allows user to not know current value, yet create a hook
   * that will modify value always relatively to the original value.
   * 
   * @example
   * values = [25, 75]
   * setter = makeValueRatioOffsetModifier(0)
   * setter(10) -> [35, 75]
   * setter(20) -> [45, 75]
   * setter(-10) -> [25, 75]
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