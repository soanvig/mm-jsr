import { getInput } from '@/testHelpers/getInput';
import test from 'ava';
import { ModuleLimit } from './ModuleLimit';

test('limit to min', t => {
  const { config, state } = getInput({ initialValues: [10] });
  const updatedState = new ModuleLimit({ min: 20 }).update(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 20);
});

test('limit to max', t => {
  const { config, state } = getInput({ initialValues: [30] });
  const updatedState = new ModuleLimit({ max: 20 }).update(config, state, { changedValues: [0] });

  t.is(updatedState.values[0].asReal(), 20);
});
