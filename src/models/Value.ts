export type RealValue = number & { _real: 1 };
export type RatioValue = number & { _ratio: 1 };
export type FormattedValue = string;

interface Ctor {
  min: number;
  max: number;
  real: number;
  formatter: (v: number) => string;
}

export class Value {
  private formatter: (v: RealValue) => FormattedValue;
  private real: RealValue;
  private min: number;
  private max: number;

  private constructor (ctor: Ctor) {
    this.real = ctor.real as RealValue;
    this.min = ctor.min;
    this.max = ctor.max;
    this.formatter = ctor.formatter;
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

  public asFormatted (): FormattedValue {
    return this.formatter(this.real);
  }

  public static fromData (data: Ctor): Value {
    return new Value(data);
  }
}