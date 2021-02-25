import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

export class ModuleBar extends Module {
  public destroy () {}

  public initView () {
    const bar = document.createElement('div');

    bar.classList.add('jsr_bar');

    this.renderer.addChild(bar);
  }

  public render (_: StateDto): VoidFunction {
    return () => {};
  }
}