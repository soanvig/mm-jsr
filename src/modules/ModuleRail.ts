import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

export class ModuleRail extends Module {
  private rail!: HTMLElement;

  public destroy () {
    this.rail.remove();
  }

  public initView () {
    this.rail = document.createElement('div');

    this.rail.classList.add('jsr_rail');

    this.renderer.addChild(this.rail);

    this.rail.addEventListener('click', this.handleClick);
  }

  public render (_: StateDto): VoidFunction {
    return () => {};
  }

  private handleClick = (e: MouseEvent) => {
    this.input.setClosestRatioValue(this.renderer.positionToRelative(e.clientX));
  }
}