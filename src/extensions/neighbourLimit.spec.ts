import { Config } from '@/models/Config';
import { State } from '@/models/State';
import { Value } from '@/models/Value';
import test from 'ava';
import { extensionNeighbourLimit } from './neighbourLimit';

test('single value - limit to min', t => {
  const { config, state } = getInput([-20]);
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 0);
});

test('single value - limit to max', t => {
  const { config, state } = getInput([120]);
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 100);
});

test('three values - limit middle one to left neighbour', t => {
  const { config, state } = getInput([30, 20, 70]);
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [1] });

  t.is(updatedState.values[1].asReal(), 30);
});

test('three values - limit middle one to right neighbour', t => {
  const { config, state } = getInput([30, 80, 70]);
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [1] });

  t.is(updatedState.values[1].asReal(), 70);
});

const getInput = (values: number[]) => {
  const min = 0;
  const max = 100;

  const config = Config.createFromInput({
    initialValues: values,
    min,
    max,
  });

  const state = State.fromData({
    values: values.map(v => (
      Value.fromData({ formatter: r => r.toString(), min, max, real: v })
    )),
  });

  return { config, state };
};