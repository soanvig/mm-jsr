import { Extension } from '@/extensions/types';
import { mapChanged } from '@/helpers/mapChanged';

export const extensionLimit: Extension = (config, state, changelog) => {
  const { values } = state;

  const limitedValues = mapChanged(values, changelog.changedValues, (value, index, processedValues) => (
    value.clampReal(
      config.limit?.min ?? -Infinity,
      config.limit?.max ?? +Infinity,
    )
  ));

  return state.updateValues(limitedValues);
};
