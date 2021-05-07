import { Config } from '@/models/Config';
import { AssertError } from '@/validation/assert';
import test from 'ava';

test('input validation', t => {
  t.assert(getConfig());

  t.throws(
    () => getConfig({
      min: '0' as any,
    }),
    { instanceOf: AssertError },
  );

  t.throws(
    () => getConfig({
      max: '100' as any,
    }),
    { instanceOf: AssertError },
  );

  t.throws(
    () => getConfig({
      initialValues: 50 as any,
    }),
    { instanceOf: AssertError },
  );

  t.throws(
    () => getConfig({
      initialValues: ['50', 25] as any,
    }),
    { instanceOf: AssertError },
  );

  t.throws(
    () => getConfig({
      container: undefined as any,
    }),
    { instanceOf: AssertError },
  );
});

test('stepDecimals', t => {
  t.is(getConfig({ step: 1 }).stepDecimals, 0);
  t.is(getConfig({ step: 0.1 }).stepDecimals, 1);
  t.is(getConfig({ step: 0.01 }).stepDecimals, 2);
  t.is(getConfig({ step: 10 }).stepDecimals, 0);

  // edge case
  t.is(getConfig({ step: 0 }).stepDecimals, 0);
});

const configDefaults = {
  min: 0,
  max: 100,
  initialValues: [25, 50],
  step: 1,
  container: document.body,
};

const getConfig = (input?: Partial<typeof configDefaults>) => Config.createFromInput({
  ...configDefaults,
  ...input,
});
