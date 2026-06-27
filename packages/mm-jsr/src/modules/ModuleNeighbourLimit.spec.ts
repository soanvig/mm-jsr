import { ModuleNeighourLimit } from '../modules/ModuleNeighbourLimit';
import { getInput } from '../testHelpers/getInput';
import { expect, test } from 'vitest';

test('single value - limit to min', () => {
  const { config, state } = getInput({ initialValues: [-20] });
  const updatedState = new ModuleNeighourLimit().update(config, state, { changedValues: [0] });

  expect(updatedState.values[0].asReal()).toBe(0);
});

test('single value - limit to max', () => {
  const { config, state } = getInput({ initialValues: [120] });
  const updatedState = new ModuleNeighourLimit().update(config, state, { changedValues: [0] });

  expect(updatedState.values[0].asReal()).toBe(100);
});

test('three values - limit middle one to left neighbour', () => {
  const { config, state } = getInput({ initialValues: [30, 20, 70] });
  const updatedState = new ModuleNeighourLimit().update(config, state, { changedValues: [1] });

  expect(updatedState.values[1].asReal()).toBe(30);
});

test('three values - limit middle one to right neighbour', () => {
  const { config, state } = getInput({ initialValues: [30, 80, 70] });
  const updatedState = new ModuleNeighourLimit().update(config, state, { changedValues: [1] });

  expect(updatedState.values[1].asReal()).toBe(70);
});
