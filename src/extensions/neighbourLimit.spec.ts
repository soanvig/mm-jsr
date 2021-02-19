import { getInput } from '@/helpers/getInput';
import test from 'ava';
import { extensionNeighbourLimit } from './neighbourLimit';

test('single value - limit to min', t => {
  const { config, state } = getInput({ initialValues: [-20] });
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 0);
});

test('single value - limit to max', t => {
  const { config, state } = getInput({ initialValues: [120] });
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 100);
});

test('three values - limit middle one to left neighbour', t => {
  const { config, state } = getInput({ initialValues: [30, 20, 70] });
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [1] });

  t.is(updatedState.values[1].asReal(), 30);
});

test('three values - limit middle one to right neighbour', t => {
  const { config, state } = getInput({ initialValues: [30, 80, 70] });
  const updatedState = extensionNeighbourLimit(config, state, { changedValues: [1] });

  t.is(updatedState.values[1].asReal(), 70);
});
