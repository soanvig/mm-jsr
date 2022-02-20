import { Changelog, Module } from '@/modules/Module';
import { mapChanged } from '@/helpers/mapChanged';
import { ConfigDto } from '@/models/Config';
import { State } from '@/models/State';

/**
 * Module responsible for rounding all values to closest to configured step multiplier.
 */
export class ModuleRound extends Module {
  public update (config: ConfigDto, state: State, changelog: Changelog): State {
    const { values } = state;
    const { step } = config;

    const roundedValues = mapChanged(values, changelog.changedValues, value => (
      value.changeReal(Math.round(value.asReal() / step) * step)
    ));

    return state.updateValues(roundedValues);
  }
}