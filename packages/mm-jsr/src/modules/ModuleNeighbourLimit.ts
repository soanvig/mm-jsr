import { mapChanged } from '@/helpers/mapChanged';
import { ConfigDto } from '@/models/Config';
import { State } from '@/models/State';
import { Changelog, Module } from '@/modules/Module';

/**
 * Module responsible for limiting values so they never exceed neighbour values.
 */
export class ModuleNeighourLimit extends Module {
  public update (config: ConfigDto, state: State, changelog: Changelog): State {
    const { values } = state;

    const limitedValues = mapChanged(values, changelog.changedValues, (value, index, processedValues) => (
      value
        .clampReal(
          processedValues[index - 1]?.asReal() ?? -Infinity,
          processedValues[index + 1]?.asReal() ?? +Infinity,
        )
        .clampReal(config.min, config.max)
    ));

    return state.updateValues(limitedValues);
  }
}