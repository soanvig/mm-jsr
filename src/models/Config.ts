import { assert, isArray, isFunction, isInstanceOf, isNumber, isPlainObject } from '@/validation/assert';

export interface ConfigAttrs {
  // core
  min: number;
  max: number;
  step: number;
  initialValues: number[];

  // formatting
  formatter: (v: number) => string;

  // limit
  limit?: { min?: number; max?: number };

  // renderer
  container: HTMLElement;
}

export interface ConfigDto extends ConfigAttrs {
  stepDecimals: number;
  valuesCount: number;
}

export class Config {
  private attrs: ConfigAttrs;

  private constructor (attrs: ConfigAttrs) {
    this.attrs = attrs;
  }

  public toDto (): Readonly<ConfigDto> {
    return Object.freeze({
      ...this.attrs,
      stepDecimals: this.stepDecimals,
      valuesCount: this.valuesCount,
    });
  }

  public get max () {
    return this.attrs.max;
  }

  public get min () {
    return this.attrs.min;
  }

  public get step () {
    return this.attrs.step;
  }

  public get formatter () {
    return this.attrs.formatter;
  }

  public get stepDecimals (): number {
    const compute = (n: number): number => {
      if (n === 0) {
        return 0;
      }

      return (n >= 1 ? 0 : (1 + compute(n * 10)));
    };

    return compute(this.step);
  }

  public get valuesCount (): number {
    return this.attrs.initialValues.length;
  }

  public static createFromInput (attrs: ConfigAttrs): Config {
    assert('min', attrs.min, isNumber);
    assert('max', attrs.max, isNumber);
    assert('step', attrs.step, isNumber);
    assert('initialValues', attrs.initialValues, isArray(isNumber));
    assert('container', attrs.container, isInstanceOf(window.HTMLElement));
    assert('formatter', attrs.formatter, isFunction);

    if (attrs.limit) {
      assert('limit', attrs.limit, isPlainObject);

      attrs.limit.min && assert('limit.min', attrs.limit.min, isNumber);
      attrs.limit.max && assert('limit.min', attrs.limit.max, isNumber);
    }


    return new Config(attrs);
  }
}