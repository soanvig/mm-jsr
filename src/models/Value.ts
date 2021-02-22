export type RealValue = number;
export type RatioValue = number;

interface Data {
  min: RealValue;
  max: RealValue;
  real: RealValue;
}

export class Value {
  private real: RealValue;
  private min: RealValue;
  private max: RealValue;

  private constructor (ctor: Data) {
    this.real = ctor.real as RealValue;
    this.min = ctor.min;
    this.max = ctor.max;
  }

  public clampReal (min: RealValue, max: RealValue) {
    return new Value({
      ...this.toData(),
      real: Math.min(max, Math.max(min, this.real)),
    });
  }

  public changeReal (real: RealValue) {
    return new Value({
      ...this.toData(),
      real,
    });
  }

  public asReal (): RealValue {
    return this.real;
  }

  public asRatio (): RatioValue {
    const computed = (this.real - this.min) / (this.max - this.min);

    // if max equal min, or real equals min AND max equal min,
    // anyway, fallback to 1.
    const finite = Number.isFinite(computed) ? computed : 1;

    return finite as RatioValue;
  }

  public static fromData (data: Data): Value {
    return new Value(data);
  }

  private toData () {
    return {
      min: this.min,
      max: this.max,
      real: this.real,
    };
  }
}