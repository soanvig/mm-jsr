import { Config } from '../models/Config';
import { AssertError } from '../validation/assert';
import { expect, test } from 'vitest';

test('input validation', () => {
  expect(() => getConfig()).not.toThrow();

  expect(() =>
    getConfig({
      min: '0' as any,
    }),
  ).toThrow(AssertError);

  expect(() =>
    getConfig({
      max: '100' as any,
    }),
  ).toThrow(AssertError);

  expect(() =>
    getConfig({
      initialValues: 50 as any,
    }),
  ).toThrow(AssertError);

  expect(() =>
    getConfig({
      initialValues: ['50', 25] as any,
    }),
  ).toThrow(AssertError);

  expect(() =>
    getConfig({
      container: undefined as any,
    }),
  ).toThrow(AssertError);
});

test('stepDecimals', () => {
  expect(getConfig({ step: 1 }).stepDecimals).toBe(0);
  expect(getConfig({ step: 0.1 }).stepDecimals).toBe(1);
  expect(getConfig({ step: 0.01 }).stepDecimals).toBe(2);
  expect(getConfig({ step: 10 }).stepDecimals).toBe(0);

  // edge case
  expect(getConfig({ step: 0 }).stepDecimals).toBe(0);
});

const configDefaults = {
  min: 0,
  max: 100,
  initialValues: [25, 50],
  step: 1,
  container: document.body,
};

const getConfig = (input?: Partial<typeof configDefaults>) =>
  Config.createFromInput({
    ...configDefaults,
    ...input,
  });
