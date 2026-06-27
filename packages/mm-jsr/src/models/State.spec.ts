import { Value } from '../models/Value';
import { expect, test } from 'vitest';
import { State } from './State';

test('findChangedValues', () => {
  const values = generateValues(3);

  const state1 = State.fromData({
    values,
  });

  const state2 = State.fromData({
    values: [values[0], ...generateValues(1), values[2], ...generateValues(1)],
  });

  expect(state1.findChangedValues(state2)).toEqual([1, 3]);
});

const generateValues = (n: number) => {
  return new Array(n).fill(null).map((_) =>
    Value.fromReal({
      min: 0,
      max: 100,
      real: 25,
    }),
  );
};
