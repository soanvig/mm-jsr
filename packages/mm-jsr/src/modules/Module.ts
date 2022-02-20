import { InputHandler } from '@/InputHandler';
import { ConfigDto } from '@/models/Config';
import { State, StateDto } from '@/models/State';
import { Renderer } from '@/Renderer';

export interface ModuleArgs {
  name: string;
  renderer: Renderer;
  config: ConfigDto;
  input: InputHandler;
}

export interface Changelog {
  changedValues: number[];
}

/**
 * If user wants to create his/her own module,
 * it needs to extend this module, and implement all abstract methods.
 */
export abstract class Module {
  protected name!: string;
  protected renderer!: Renderer;
  protected config!: ConfigDto;
  protected input!: InputHandler;

  /**
   * Tells, how the module should be destroyed.
   * This usually involves removing all created HTML elements,
   * and event handlers, that were attached to other than removed elements.
   */
  public destroy? (): void;

  /**
   * Tells, how the module should render.
   * This function is called everytime something changes within the application.
   */
  public render? (state: StateDto): VoidFunction;

  /**
   * Called once, when JSR is ready to append this module to HTML DOM.
   * All element creation and event handler should be bind here.
   */
  public initView? (): void;

  /**
   * Called every time state is updated - any further updates can be applied here,
   * returning new state. See RoundToStep module for example.
   */
  public update? (config: ConfigDto, state: State, changelog: Changelog): State;

  /**
   * Initial configuration of a module, providing it with dependencies.
   * Called internally.
   *
   * @private
   */
  public init (args: ModuleArgs) {
    this.renderer = args.renderer;
    this.config = args.config;
    this.input = args.input;
    this.name = args.name;

    return this;
  }
}