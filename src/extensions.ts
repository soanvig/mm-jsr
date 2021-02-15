import { Config } from '@/models/Config';
import type { State } from '@/models/State';

export interface Changelog {
  changedValues: number[];
}

export type Extension = (config: Config, state: State, changelog: Changelog) => State;

export const extensionNeighbourLimit: Extension = (config, state, changelog) => {
  const { values } = state;

  const limitedValues = values.map((value, index, processedValues) => {
    if (changelog.changedValues.includes(index)) {
      return value
        .clampReal(
          processedValues[index - 1]?.asReal() ?? -Infinity,
          processedValues[index + 1]?.asReal() ?? +Infinity,
        )
        .clampReal(config.min, config.max);
    } else {
      return value;
    }
  });

  return state.updateValues(limitedValues);
};