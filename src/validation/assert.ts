export class AssertError extends Error {
  constructor (valueName: string, value: AssertionValue, message: string) {
    super(`Invalid ${valueName}: ${message}. Got: ${value}`);
  }
}

type AssertionValue = string | number | object | AssertionValue[];
type AssertFunction = (v: AssertionValue) => false | { error: string, value: AssertionValue };

export const assert = (valueName: string, value: AssertionValue, assertFunction: AssertFunction) => {
  const assertion = assertFunction(value);

  if (assertion) {
    throw new AssertError(valueName, assertion.value, assertion.error);
  }
};

export const isInstanceOf = (klass: any): AssertFunction => v =>
  (v instanceof klass ? false : { error: `expected instance of ${klass.name}`, value: v.constructor.name });

export const isNumber: AssertFunction = v =>
  (Number.isFinite(v) ? false : { error: 'expected number', value: v });

export const isArray = (assertFunction: AssertFunction): AssertFunction => v => {
  if (!Array.isArray(v)) {
    return {
      error: 'expected array',
      value: v,
    };
  }

  const assertions = v.map(assertFunction);

  return assertions.find(Boolean) ?? false;
};