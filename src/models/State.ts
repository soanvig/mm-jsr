
import { Value } from '@/models/Value';

interface Ctor {
  value: Value;
}

export class State {
  private value: Value;

  private constructor (ctor: Ctor) {
    this.value = ctor.value;
  }

  public static fromData (data: Ctor): State {
    return new State(data);
  }
}