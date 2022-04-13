import { assert, isArray, isInstanceOf, isNumber, isPlainObject } from '@/validation/assert';

export interface ConfigAttrs {
  /** Minimum value JSR can accept */
  min: number;

  /** Maximum value JSR can accept */
  max: number;

  /**
   * Step between values (can be float)
   *
   * @example
   * for min: 0, and max: 100, and step: 1 it gives you 101 possible values
   *
   * @example
   * for step: 0.1 it gives you 1001 possible values
   */
  step: number;

  /**
   * Initial values for JSR. Determines number of supported values at all.
   */
  initialValues: number[];

  /**
   * Container, that will contain all the modules.
   */
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

  /**
   * Return how many decimal places the step has.
   */
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

    return new Config(attrs);
  }
}