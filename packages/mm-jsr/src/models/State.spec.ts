import { Value } from '@/models/Value';
import test from 'ava';
import { State } from './State';

test('findChangedValues', t => {
  const values = generateValues(3);

  const state1 = State.fromData({
    values,
  });

  const state2 = State.fromData({
    values: [
      values[0],
      ...generateValues(1),
      values[2],
      ...generateValues(1),
    ],
  });

  t.deepEqual(state1.findChangedValues(state2), [1, 3]);
});


const generateValues = (n: number) => {
  return new Array(n).fill(null).map(_ => Value.fromReal({
    min: 0,
    max: 100,
    real: 25,
  }));
};