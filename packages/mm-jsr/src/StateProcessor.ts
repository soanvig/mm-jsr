import { ChangeLimitCommand, State, StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import type { Extension, Changelog } from '@/extensions/types';
import { ConfigDto } from '@/models/Config';
import { extensionNeighbourLimit } from '@/extensions/neighbourLimit';
import { extensionRoundToStep } from '@/extensions/roundToStep';
import { mapChanged } from '@/helpers/mapChanged';
import { extensionPerformanceEnd, extensionPerformanceStart } from '@/extensions/performance';
import { extensionLimit } from '@/extensions/limit';

interface Ctor {
  config: ConfigDto;
}

/**
 * StateProcessor is responsible for State object manipulation.
 * 
 * It uses *extensions* to manipulate the state each time, something changes.
 */
export class StateProcessor {
  private state: State;
  private config: ConfigDto;

  private constructor (ctor: Ctor) {
    const configDto = ctor.config;
    const minMax = {
      min: configDto.min,
      max: configDto.max,
    };
    const values = configDto.initialValues.map(v => Value.fromReal({
      ...minMax,
      real: v,
    }));
    const limit = configDto.limit
      ? {
        min: configDto.limit.min ? Value.fromReal({ ...minMax, real: configDto.limit.min }) : undefined,
        max: configDto.limit.max ? Value.fromReal({ ...minMax, real: configDto.limit.max }) : undefined,
      }
      : undefined;

    this.config = ctor.config;
    this.state = State.fromData({
      values,
      limit,
    });

    this.state = this.process(this.state);
  }

  public changeLimit (command: ChangeLimitCommand): StateDto {
    const updatedState = this.state.changeLimit(command);

    this.state = this.process(updatedState);

    return this.state.toDto();
  }

  public updateValue (index: number, value: Value): { newState: StateDto, oldState: StateDto } {
    const oldState = this.state.toDto();

    const updatedState = this.state.updateValues(
      mapChanged(this.state.values, [index], _ => value),
    );

    this.state = this.process(updatedState);

    return {
      newState: this.state.toDto(),
      oldState,
    };
  }

  public getState (): StateDto {
    return this.state.toDto();
  }

  /**
   * Apply all extensions to state.
   */
  private process (state: State): State {
    const changedValues = this.state.findChangedValues(state);
    const extensions = [
      // extensionPerformanceStart,
      extensionNeighbourLimit,
      extensionLimit,
      extensionRoundToStep,
      // extensionPerformanceEnd,
    ];

    const updatedState = this.internalProcess(
      extensions,
      state,
      { changedValues },
    );

    return updatedState;
  }

  /**
   * Internal process function used by `process` function.
   */
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