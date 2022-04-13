import { InputHandler } from '@/InputHandler';
import { Config, ConfigAttrs } from '@/models/Config';
import { StateDto } from '@/models/State';
import { Value } from '@/models/Value';
import { Module } from '@/modules/Module';
import { Renderer } from '@/Renderer';
import { StateProcessor } from '@/StateProcessor';
import { isTruthy } from './helpers/guards';

interface SetupCommand {
  config: ConfigAttrs;
  modules: Module[];
}

export type ValueChangeHandler = (v: { index: number, real: number, ratio: number }) => void;

/**
 * Engine initializes and connects all modules together.
 */
export class Engine {
  public readonly config!: Config;
  public readonly stateProcessor!: StateProcessor;
  public readonly inputHandler!: InputHandler;
  public readonly renderer!: Renderer;
  public readonly modules!: Module[];

  /** Store for handlers for value change event */
  private valueChangeHandlers: ValueChangeHandler[] = [];

  /** Disabled Engine doesn't react on value change events */
  private enabled = true;

  public constructor (setup: SetupCommand) {
    this.config = Config.createFromInput(setup.config);

    const config = this.config.toDto();

    this.renderer = Renderer.init({
      container: config.container,
    });

    this.inputHandler = InputHandler.init({
      config,
      onChange: this.onValueChange.bind(this),
      getState: () => this.stateProcessor.getState(),
    });

    this.modules = setup.modules.map(M => M.init({
      config,
      renderer: this.renderer,
      input: this.inputHandler,
      name: M.constructor.name,
    }));

    this.stateProcessor = StateProcessor.init({
      config,
      modules: this.modules,
    });

    this.initView();
  }

  public addValueChangeHandler (handler: ValueChangeHandler): VoidFunction {
    this.valueChangeHandlers.push(handler);

    return () => this.valueChangeHandlers = this.valueChangeHandlers.filter(h => h !== handler);
  }

  public enable () {
    this.renderer.getContainer().classList.remove('is-disabled');
    this.enabled = true;
  }

  public disable () {
    this.renderer.getContainer().classList.add('is-disabled');
    this.enabled = false;
  }

  public isEnabled () {
    return this.enabled;
  }

  /**
   * Create Value object from real value.
   */
  public produceRealValue (value: number): Value {
    return Value.fromReal({
      real: value,
      max: this.config.max,
      min: this.config.min,
    });
  }

  /**
   * Initialize views of all modules.
   */
  private initView () {
    this.modules.forEach(m => m.initView && m.initView());

    this.renderState(this.stateProcessor.getState());
  }

  /**
   * Internal handler for reacting on any value changed.
   * Updates the state, triggers value change event handlers.
   */
  private onValueChange (index: number, value: Value) {
    if (!this.enabled) {
      return;
    }

    const { oldState, newState } = this.stateProcessor.updateValue(index, value);

    this.renderState(newState);

    const isValueSame = (newState.values[index].isExact(oldState.values[index]));

    if (!isValueSame) {
      this.valueChangeHandlers.forEach(handler => {
        handler({
          index,
          ratio: newState.values[index].asRatio(),
          real: newState.values[index].asReal(),
        });
      });
    }
  }

  private renderState (state: StateDto): void {
    const renderFunctions = this.modules.map(m => m.render && m.render(state));

    this.renderer.render(renderFunctions.filter(isTruthy));
  }
}