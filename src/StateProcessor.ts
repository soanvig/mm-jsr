import { State } from '@/models/State';
import { RealValue, Value } from '@/models/Value';
import type { Extension, Changelog } from '@/extensions/types';
import { Config } from '@/models/Config';
import { extensionNeighbourLimit } from '@/extensions/neighbourLimit';
import { extensionRoundToStep } from '@/extensions/roundToStep';
import { mapChanged } from '@/helpers/mapChanged';
import { extensionPerformanceEnd, extensionPerformanceStart } from '@/extensions/performance';

interface Ctor {
  config: Config;
}

export class StateProcessor {
  private state: State;
  private config: Config;

  private constructor (ctor: Ctor) {
    const configDto = ctor.config.toDto();
    const values = configDto.initialValues.map(v => Value.fromData({
      min: configDto.min,
      max: configDto.max,
      real: v,
    }));

    this.config = ctor.config;
    this.state = State.fromData({
      values,
    });
  }

  public updateValue (index: number, value: RealValue) {
    const updatedState = this.state.updateValues(
      mapChanged(this.state.values, [index], v => v.changeReal(value)),
    );

    this.state = this.process(updatedState);

    return this.state;
  }

  public process (state: State): State {
    const changedValues = this.state.findChangedValues(state);
    const extensions = [
      extensionPerformanceStart,
      extensionNeighbourLimit,
      extensionRoundToStep,
      extensionPerformanceEnd,
    ];

    const updatedState = this.internalProcess(
      extensions,
      state,
      { changedValues },
    );

    return updatedState;
  }

  private internalProcess (extensions: Extension[], state: State, changelog: Changelog): State {
    const [extension, ...nextExtensions] = extensions;

    const updatedState = extension(this.config, state, changelog);

    if (nextExtensions.length) {
      return this.internalProcess(nextExtensions, updatedState, changelog);
    } else {
      return updatedState;
    }
  }

  public static init (ctor: Ctor) {
    return new StateProcessor(ctor);
  }
}