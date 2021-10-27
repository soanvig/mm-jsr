interface Ctor {
  container: HTMLElement;
}

/**
 * Renderer is class responsible for managing core HTML element (`container`)
 * it's position, and for performing efficient render operations.
 */
export class Renderer {
  /**
   * Container is primary HTML element that will contain
   * all other HTML elements, that are created by modules.
   */
  private container: HTMLElement;

  /** requestAnimationFrame reference */
  private rafId: number | null = null;

  private constructor (ctor: Ctor) {
    this.container = ctor.container;

    this.container.classList.add('jsr');
  }

  /**
   * @returns HTML container element
   */
  public getContainer () {
    return this.container;
  }

  /**
   * Add HTML child to container
   */
  public addChild (child: HTMLElement) {
    this.container.appendChild(child);
  }

  /**
   * Compute relative x in global coordinates relative to 
   * container position.
   * 
   * @example for container exactly in the middle of the page
   * and cursor excatly in the middle of the container
   * cursor global position put as `x` will return `0.5` as a result.
   */
  public positionToRelative (x: number): number {
    return (x - this.container.getBoundingClientRect().left) / this.container.offsetWidth;
  }

  /**
   * Compute ratio of `distance` against container size.
   * 
   * @example for distance `200` if container has width `400`
   * it will return `0.5` as a result.
   */
  public distanceToRelative (distance: number): number {
    return distance / this.container.offsetWidth;
  }

  /**
   * Enqueue render operation executing all `renderFunctions`.
   */
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