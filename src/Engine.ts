import { InputHandler } from '@/InputHandler';
import { Config, ConfigAttrs } from '@/models/Config';
import { StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { Module } from '@/modules/Module';
import { Renderer } from '@/Renderer';
import { StateProcessor } from '@/StateProcessor';
import { ModuleLabels } from '@/modules/ModuleLabel';
import { ModuleBar } from '@/modules/ModuleBar';
import { ModuleLimit } from '@/modules/ModuleLimit';
import { ModuleGrid } from '@/modules/ModuleGrid';
import { ModuleRail } from '@/modules/ModuleRail';
import { ModuleSlider } from '@/modules/ModuleSlider';

const modules = [
  ModuleRail,
  ModuleSlider,
  ModuleLabels,
  ModuleBar,
  ModuleLimit,
  ModuleGrid,
];

interface SetupCommand {
  config: ConfigAttrs;
}

export class Engine {
  public config!: Config;
  public stateProcessor!: StateProcessor;
  public inputHandler!: InputHandler;
  public renderer!: Renderer;
  public modules!: Module[];

  public constructor (setup: SetupCommand) {
    this.config = Config.createFromInput(setup.config);

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
      getState: this.stateProcessor.getState.bind(this.stateProcessor),
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
}