import { InputHandler } from '@/InputHandler';
import { Config, ConfigAttrs } from '@/models/Config';
import { ModuleRail } from '@/modules/ModuleRail';
import { ModuleSlider } from '@/modules/ModuleSlider';
import { Module } from '@/modules/Module';
import { Renderer } from '@/Renderer';
import { StateProcessor } from '@/StateProcessor';
import { Value } from '@/models/Value';
import { StateDto } from '@/models/State';

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

    this.stateProcessor = StateProcessor.init({
      config,
    });

    this.renderer = Renderer.init({
      container: config.container,
    });

    this.inputHandler = InputHandler.init({
      config,
      onChange: this.onValueChange.bind(this),
    });

    this.modules = modules.map(M => new M({
      config,
      renderer: this.renderer,
      input: this.inputHandler,
    }));

    this.initView();
  }

  private initView () {
    this.modules.forEach(m => m.initView());

    this.renderState(this.stateProcessor.getState());
  }

  private onValueChange (index: number, value: Value) {
    this.renderState(this.stateProcessor.updateValue(index, value));
  }

  private renderState (state: StateDto): void {
    const renderFunctions = this.modules.map(m => m.render(state));
    this.renderer.render(renderFunctions);
  }

  public destroy () {
    this.modules.forEach(m => m.destroy());
  }
}