
import { Value } from '@/models/Value';

interface Data {
  values: Value[];
  limit?: { min?: Value; max?: Value };
}

export interface StateDto extends Data {}

export class State {
  public readonly values: Value[];
  public readonly limit?: { min?: Value; max?: Value };

  private constructor (ctor: Data) {
    this.values = ctor.values;
    this.limit = ctor.limit;
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

  public static fromData (data: Data): State {
    return new State(data);
  }

  public toDto (): StateDto {
    return this.toData();
  }

  private toData (): Data {
    return {
      values: this.values,
      limit: this.limit,
    };
  }
}