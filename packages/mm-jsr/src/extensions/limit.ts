import { Extension } from '@/extensions/types';

/**
 * Extension responsible for clamping all values to configured `limit`.
 */
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
