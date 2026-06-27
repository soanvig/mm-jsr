import { getInput } from '../testHelpers/getInput';
import { expect, test } from 'vitest';
import { ModuleLimit } from './ModuleLimit';

test('limit to min', () => {
  const { config, state } = getInput({ initialValues: [10] });
  const updatedState = new ModuleLimit({ min: 20 }).update(config, state, { changedValues: [0] });

  expect(updatedState.values[0].asReal()).toBe(20);
});

test('limit to max', () => {
  const { config, state } = getInput({ initialValues: [30] });
  const updatedState = new ModuleLimit({ max: 20 }).update(config, state, { changedValues: [0] });

  expect(updatedState.values[0].asReal()).toBe(20);
});
