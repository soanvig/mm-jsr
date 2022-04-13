export type RealValue = number;
export type RatioValue = number;

export interface ValueData {
  min: RealValue;
  max: RealValue;
  real: RealValue;
}

export interface FromRatio {
  min: RealValue;
  max: RealValue;
  ratio: RatioValue;
}

/**
 * Value-object representing single value stored in memory.
 * For example: each slider corresponds to one value.
 *
 * Value allows for seamless transition between "real" and "ratio" representation.
 * - Real represents value, that is between config.min and config.max limit,
 * and it is the value end user is interested in.
 * - Ratio represents value relative to config.min and config.max limit: between 0 and 1.
 * It is used mostly internally for computations of slider position and so on.
 */
export class Value {
  private real: RealValue;
  private min: RealValue;
  private max: RealValue;

  private constructor (ctor: ValueData) {
    this.real = ctor.real as RealValue;
    this.min = ctor.min;
    this.max = ctor.max;
  }

  /**
   * Limit this value to min-max range (real)
   */
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

  public isExact (value: Value): boolean {
    return this.real === value.real;
  }

  public static fromReal (data: ValueData): Value {
    return new Value(data);
  }

  public static fromRatio (data: FromRatio): Value {
    return new Value({
      ...data,
      real: data.ratio * (data.max - data.min) + data.min,
    });
  }

  private toData () {
    return {
      min: this.min,
      max: this.max,
      real: this.real,
    };
  }
}