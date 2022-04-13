
import { Value } from '@/models/Value';

export interface StateData {
  values: Value[];
}

export interface StateDto extends StateData {}


/**
 * State object stores information about values, and limits,
 * and any other values, that can be dynamically changed in the system.
 */
export class State {
  public readonly values: Value[];

  private constructor (ctor: StateData) {
    this.values = ctor.values;
  }

  public updateValues (values: Value[]) {
    return new State({
      ...this.toData(),
      values,
    });
  }

  /**
   * If value exists (by instance) in @state, and doesn't exist in this.state,
   * it is marked as changed.
   */
  public findChangedValues (state: State): number[] {
    return state.values.reduce((changedValues, value, index) => {
      // it compares value instances, not value by themselves
      if (this.values.includes(value)) {
        return changedValues;
      } else {
        return changedValues.concat(index);
      }
    }, [] as number[]).sort();
  }

  public static fromData (data: StateData): State {
    return new State(data);
  }

  public toDto (): StateDto {
    return this.toData();
  }

  private toData (): StateData {
    return {
      values: this.values,
    };
  }
}