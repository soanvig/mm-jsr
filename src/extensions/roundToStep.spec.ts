import { extensionRoundToStep } from '@/extensions/roundToStep';
import { getInput } from '@/testHelpers/getInput';
import test from 'ava';

test('round to full value', t => {
  t.is(roundToStep(0, 1), 0);
  t.is(roundToStep(19.9, 1), 20);
  t.is(roundToStep(19.999, 1), 20);
  t.is(roundToStep(20, 1), 20);
  t.is(roundToStep(20.4, 1), 20);
  t.is(roundToStep(20.5, 1), 21);

  //

  t.is(roundToStep(20.5, 2), 20);
  t.is(roundToStep(21, 2), 22);
  t.is(roundToStep(22, 2), 22);
});

const roundToStep = (value: number, step: number): number => {
  const { config, state } = getInput({ initialValues: [value], step });
  const updatedState = extensionRoundToStep(config, state, { changedValues: [0] });

  return updatedState.values[0].asReal();
};