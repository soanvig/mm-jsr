import { InputHandler } from '@/InputHandler';
import { Config, ConfigAttrs } from '@/models/Config';
import { ModuleRail } from '@/modules/ModuleRail';
import { ModuleSlider } from '@/modules/ModuleSlider';
import { Module } from '@/modules/Module';
import { Renderer } from '@/Renderer';
import { StateProcessor } from '@/StateProcessor';

interface Ctor {
  config: ConfigAttrs;
}

const modules = [
  ModuleRail,
  ModuleSlider,
];

export class JSR {
  private config: Config;
  private stateProcessor: StateProcessor;
  private inputHandler: InputHandler;
  private renderer: Renderer;
  private modules: Module[];

  public constructor (ctor: Ctor) {
    this.config = Config.createFromInput(ctor.config);

    const config = this.config.toDto();
    this.stateProcessor = StateProcessor.init({ config });
    this.inputHandler = InputHandler.init();
    this.renderer = Renderer.init({ container: config.container });

    this.modules = modules.map(M => new M({
      config,
      renderer: this.renderer,
      input: this.inputHandler,
    }));
  }

  public tmpTest () {
    this.modules.forEach(m => m.initView());

    const state = this.stateProcessor.getState();

    this.modules.forEach(m => m.render(state)());
  }

  public destroy () {
    this.modules.forEach(m => m.destroy());
  }
}