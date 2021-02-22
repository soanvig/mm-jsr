interface Ctor {
  container: HTMLElement;
}

export class Renderer {
  private container: HTMLElement;

  private constructor (ctor: Ctor) {
    this.container = ctor.container;
  }

  public static init (ctor: Ctor) {
    return new Renderer(ctor);
  }
}