
import { Value } from '@/models/Value';

interface Data {
  values: Value[];
}

export class State {
  public readonly values: Value[];

  private constructor (ctor: Data) {
    this.values = ctor.values;
  }

  public updateValues (values: Value[]) {
    return new State({
      ...this.toData(),
      values,
    });
  }

  public findChangedValues (state: State): number[] {
    return state.values.reduce((changedValues, value, index) => {
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

  private toData (): Data {
    return {
      values: this.values,
    };
  }
}