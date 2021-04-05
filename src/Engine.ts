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

export type ValueChangeHandler = (v: { index: number, real: number, ratio: number }) => void;

export class Engine {
  public readonly config!: Config;
  public readonly stateProcessor!: StateProcessor;
  public readonly inputHandler!: InputHandler;
  public readonly renderer!: Renderer;
  public readonly modules!: Module[];

  private readonly valueChageHandlers: ValueChangeHandler[] = [];

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

  public addValueChangeHandler (handler: ValueChangeHandler) {
    this.valueChageHandlers.push(handler);
  }

  private initView () {
    this.modules.forEach(m => m.initView());

    this.renderState(this.stateProcessor.getState());
  }

  private onValueChange (index: number, value: Value) {
    const state = this.stateProcessor.updateValue(index, value);

    this.renderState(state);

    this.valueChageHandlers.forEach(handler => {
      handler({
        index,
        ratio: state.values[index].asRatio(),
        real: state.values[index].asReal(),
      });
    });
  }

  private renderState (state: StateDto): void {
    const renderFunctions = this.modules.map(m => m.render(state));
    this.renderer.render(renderFunctions);
  }
}