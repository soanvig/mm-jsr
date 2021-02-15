import { assert, isArray, isNumber } from '@/validation/assert';

interface ConfigAttrs {
  min: number;
  max: number;
  initialValues: number[];
}

export class Config {
  private attrs: ConfigAttrs;

  private constructor (attrs: ConfigAttrs) {
    this.attrs = attrs;
  }

  public toDto (): Readonly<ConfigAttrs> {
    return this.attrs;
  }

  public get max () {
    return this.attrs.max;
  }

  public get min () {
    return this.attrs.min;
  }

  public static createFromInput (attrs: ConfigAttrs): Config {
    assert('min', attrs.min, isNumber);
    assert('max', attrs.max, isNumber);
    assert('initialValues', attrs.initialValues, isArray(isNumber));

    return new Config(attrs);
  }
}