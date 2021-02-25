import { ConfigDto } from '@/models/Config';
import { StateDto } from '@/models/State';
import { Renderer } from '@/Renderer';

export interface ModuleArgs {
  renderer: Renderer;
  config: ConfigDto;
}

export abstract class Module {
  protected renderer: Renderer;
  protected config: ConfigDto;

  public constructor (args: ModuleArgs) {
    this.renderer = args.renderer;
    this.config = args.config;
  }

  public abstract destroy (): void;
  public abstract render (state: StateDto): VoidFunction;
  public abstract initView (): void;
}