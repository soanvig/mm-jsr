import { ChangeStateLimitCommand, State, StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { ConfigDto } from '@/models/Config';
import { mapChanged } from '@/helpers/mapChanged';
import { Changelog, Module } from '@/modules/Module';

interface Ctor {
  config: ConfigDto;
  modules: Module[];
}

/**
 * StateProcessor is responsible for State object manipulation.
 *
 * It uses *extensions* to manipulate the state each time, something changes.
 */
export class StateProcessor {
  private state: State;
  private config: ConfigDto;
  private modules: Module[];

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
    this.modules = ctor.modules;
    this.state = State.fromData({
      values,
      limit,
    });

    this.state = this.process(this.state, this.modules);
  }

  public changeLimit (command: ChangeStateLimitCommand): StateDto {
    const updatedState = this.state.changeLimit(command);

    this.state = this.process(updatedState, this.modules);

    return this.state.toDto();
  }

  public updateValue (index: number, value: Value): { newState: StateDto, oldState: StateDto } {
    const oldState = this.state.toDto();

    const updatedState = this.state.updateValues(
      mapChanged(this.state.values, [index], _ => value),
    );

    this.state = this.process(updatedState, this.modules);

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
  private process (state: State, modules: Module[]): State {
    const changedValues = this.state.findChangedValues(state);

    const updatedState = this.internalProcess(
      modules,
      state,
      { changedValues },
    );

    return updatedState;
  }

  /**
   * Internal process function used by `process` function.
   */
  private internalProcess (modules: Module[], state: State, changelog: Changelog): State {
    const [mod, ...rest] = modules;

    if (rest.length === 0) {
      return state;
    }

    if (!mod.update) {
      return this.internalProcess(rest, state, changelog);
    }

    const updatedState = mod.update(this.config, state, changelog);

    return this.internalProcess(rest, updatedState, changelog);
  }

  public static init (ctor: Ctor) {
    return new StateProcessor(ctor);
  }
}