import { Extension } from '@/extensions/types';

export const extensionLimit: Extension = (config, state, changelog) => {
  const { values } = state;

  // @NOTE this modified all values. Should changelog include these values then??
  const limitedValues = values.map(value => (
    value.clampReal(
      state.limit?.min?.asReal() ?? -Infinity,
      state.limit?.max?.asReal() ?? +Infinity,
    )
  ));

  return state.updateValues(limitedValues);
};
