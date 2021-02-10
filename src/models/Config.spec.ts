import { Config } from '@/models/Config';
import { AssertError } from '@/validation/assert';
import test from 'ava';

test('input validation', t => {
  t.assert(Config.createFromInput(configDefaults));

  t.throws(
    () => Config.createFromInput({
      ...configDefaults,
      min: '0' as any,
    }),
    { instanceOf: AssertError },
  );

  t.throws(
    () => Config.createFromInput({
      ...configDefaults,
      max: '100' as any,
    }),
    { instanceOf: AssertError },
  );

  t.throws(
    () => Config.createFromInput({
      ...configDefaults,
      initialValues: 50 as any,
    }),
    { instanceOf: AssertError },
  );

  t.throws(
    () => Config.createFromInput({
      ...configDefaults,
      initialValues: ['50', 25] as any,
    }),
    { instanceOf: AssertError },
  );
});

const configDefaults = {
  min: 0,
  max: 100,
  initialValues: [25, 50],
};