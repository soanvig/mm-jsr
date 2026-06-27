import { ModuleRound } from '../modules/ModuleRound';
import { getInput } from '../testHelpers/getInput';
import { expect, test } from 'vitest';

test('round to full value', () => {
  expect(roundToStep(0, 1)).toBe(0);
  expect(roundToStep(19.9, 1)).toBe(20);
  expect(roundToStep(19.999, 1)).toBe(20);
  expect(roundToStep(20, 1)).toBe(20);
  expect(roundToStep(20.4, 1)).toBe(20);
  expect(roundToStep(20.5, 1)).toBe(21);

  //

  expect(roundToStep(20.5, 2)).toBe(20);
  expect(roundToStep(21, 2)).toBe(22);
  expect(roundToStep(22, 2)).toBe(22);
});

const roundToStep = (value: number, step: number): number => {
  const { config, state } = getInput({ initialValues: [value], step });
  const updatedState = new ModuleRound().update(config, state, { changedValues: [0] });

  return updatedState.values[0].asReal();
};
