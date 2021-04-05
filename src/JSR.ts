import { Engine } from '@/Engine';
import { ConfigAttrs } from '@/models/Config';

interface Ctor {
  config: ConfigAttrs;
}

export class JSR {
  private engine: Engine;

  public constructor (ctor: Ctor) {
    this.engine = new Engine({
      config: ctor.config,
    });
  }

  public destroy () {
    this.engine.modules.forEach(m => m.destroy());
  }
}