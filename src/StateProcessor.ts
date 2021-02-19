import { State } from '@/models/State';
import { Value } from '@/models/Value';
import type { Extension, Changelog } from '@/extensions/types';
import { Config } from '@/models/Config';

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
      formatter: v => v.toString(),
    }));

    this.config = ctor.config;
    this.state = State.fromData({
      values,
    });
  }

  public process (): void {
    const updatedState = this.internalProcess([], this.state, { changedValues: [] });

    this.state = updatedState;
  }

  private internalProcess (extensions: Extension[], state: State, changelog: Changelog): State {
    const [extension, ...nextExtensions] = extensions;

    const updatedState = extension(this.config, state, changelog);

    if (extension.length) {
      return this.internalProcess(nextExtensions, updatedState, changelog);
    } else {
      return updatedState;
    }
  }

  public static init (ctor: Ctor) {
    return new StateProcessor(ctor);
  }
}