import { Config, ConfigAttrs } from '@/models/Config';
import { State } from '@/models/State';
import { Value } from '@/models/Value';

export const getInput = ({
  initialValues = [50],
  min = 0,
  max = 100,
  step = 1,
}: Partial<ConfigAttrs>) => {
  const config = Config.createFromInput({
    initialValues,
    min,
    max,
    step,
    container: document.body,
  }).toDto();

  const state = State.fromData({
    values: initialValues.map(v => (
      Value.fromReal({ min, max, real: v })
    )),
  });

  return { config, state };
};