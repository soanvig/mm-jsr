import { getInput } from '@/testHelpers/getInput';
import test from 'ava';
import { extensionLimit } from './limit';

test('limit to min', t => {
  const { config, state } = getInput({ limit: { min: 20 }, initialValues: [10] });
  const updatedState = extensionLimit(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 20);
});

test('limit to max', t => {
  const { config, state } = getInput({ limit: { max: 20 }, initialValues: [30] });
  const updatedState = extensionLimit(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 20);
});
