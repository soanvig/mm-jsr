interface Ctor {
  container: HTMLElement;
}

export class Renderer {
  private container: HTMLElement;
  private rafId: number | null = null;

  private constructor (ctor: Ctor) {
    this.container = ctor.container;

    this.container.classList.add('jsr');
  }

  public addChild (child: HTMLElement) {
    this.container.appendChild(child);
  }

  public xToRelative (x: number): number {
    return (x - this.container.offsetLeft) / this.container.offsetWidth;
  }

  public render (renderFunctions: VoidFunction[]): void {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
    }

    this.rafId = window.requestAnimationFrame(() => {
      renderFunctions.forEach(f => f());
      this.rafId = null;
    });
  }

  public static init (ctor: Ctor) {
    return new Renderer(ctor);
  }
}