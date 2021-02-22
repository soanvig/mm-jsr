import { Config, ConfigAttrs } from '@/models/Config';
import { StateProcessor } from '@/StateProcessor';

interface Ctor {
  config: ConfigAttrs;
}

export class JSR {
  private config: Config;
  private stateProcessor: StateProcessor;

  public constructor (ctor: Ctor) {
    this.config = Config.createFromInput(ctor.config);
    this.stateProcessor = StateProcessor.init({ config: this.config });
  }

  public destroy () {
    throw new Error('Not implemented');
  }
}