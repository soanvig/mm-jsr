import { Extension } from '@/extensions/types';
import { mapChanged } from '@/helpers/mapChanged';

/**
 * Extension responsible for rounding all values to closest to configured step multiplier.
 */
export const extensionRoundToStep: Extension = (config, state, changelog) => {
  const { values } = state;
  const { step } = config;

  const roundedValues = mapChanged(values, changelog.changedValues, value => (
    value.changeReal(Math.round(value.asReal() / step) * step)
  ));

  return state.updateValues(roundedValues);
};