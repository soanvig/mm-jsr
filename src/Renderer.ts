interface Ctor {
  container: HTMLElement;
}

export class Renderer {
  private container: HTMLElement;

  private constructor (ctor: Ctor) {
    this.container = ctor.container;

    this.container.classList.add('jsr');
  }

  public addChild (child: HTMLElement) {
    this.container.appendChild(child);
  }

  public static init (ctor: Ctor) {
    return new Renderer(ctor);
  }
}