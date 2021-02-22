import { assert, isArray, isInstanceOf, isNumber } from '@/validation/assert';

export interface ConfigAttrs {
  // core
  min: number;
  max: number;
  step: number;
  initialValues: number[];

  // renderer
  container: HTMLElement;
}

export interface ConfigDto extends ConfigAttrs {}

export class Config {
  private attrs: ConfigAttrs;

  private constructor (attrs: ConfigAttrs) {
    this.attrs = attrs;
  }

  public toDto (): Readonly<ConfigDto> {
    return this.attrs;
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

  public static createFromInput (attrs: ConfigAttrs): Config {
    assert('min', attrs.min, isNumber);
    assert('max', attrs.max, isNumber);
    assert('step', attrs.step, isNumber);
    assert('initialValues', attrs.initialValues, isArray(isNumber));
    assert('container', attrs.container, isInstanceOf(window.HTMLElement));

    return new Config(attrs);
  }
}