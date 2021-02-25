import { InputHandler } from '@/InputHandler';
import { Config, ConfigAttrs } from '@/models/Config';
import { Renderer } from '@/Renderer';
import { StateProcessor } from '@/StateProcessor';

interface Ctor {
  config: ConfigAttrs;
}

export class JSR {
  private config: Config;
  private stateProcessor: StateProcessor;
  private inputHandler: InputHandler;
  private renderer: Renderer;

  public constructor (ctor: Ctor) {
    this.config = Config.createFromInput(ctor.config);

    const config = this.config.toDto();
    this.stateProcessor = StateProcessor.init({ config });
    this.inputHandler = InputHandler.init();
    this.renderer = Renderer.init({ container: config.container });
  }

  public destroy () {
    throw new Error('Not implemented');
  }
}