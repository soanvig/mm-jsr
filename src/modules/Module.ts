import { InputHandler } from '@/InputHandler';
import { ConfigDto } from '@/models/Config';
import { StateDto } from '@/models/State';
import { Renderer } from '@/Renderer';

export interface ModuleArgs {
  renderer: Renderer;
  config: ConfigDto;
  input: InputHandler;
}

export abstract class Module {
  protected renderer!: Renderer;
  protected config!: ConfigDto;
  protected input!: InputHandler;

  public abstract destroy (): void;
  public abstract render (state: StateDto): VoidFunction;
  public abstract initView (): void;

  public init (args: ModuleArgs) {
    this.renderer = args.renderer;
    this.config = args.config;
    this.input = args.input;

    return this;
  }
}