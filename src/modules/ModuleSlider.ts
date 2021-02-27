import { useOnMove } from '@/events/useOnMove';
import { StateDto } from '@/models/State';
import { Module } from '@/modules/Module';

export class ModuleSlider extends Module {
  private sliders: HTMLElement[] = [];

  public destroy () {
    this.sliders.forEach(s => s.remove());
  }

  public initView () {
    this.sliders = this.config.initialValues.map((_, index) => {
      const slider = document.createElement('div');
      slider.classList.add('jsr_slider');
      slider.style.left = '0';

      useOnMove(slider, e => console.log(this.renderer.xToRelative(e.clientX)));

      return slider;
    });

    this.sliders.forEach(slider => this.renderer.addChild(slider));
  }

  public render (state: StateDto): VoidFunction {
    return () => {
      state.values.forEach((value, i) => {
        this.sliders[i].style.left = `${value.asRatio() * 100}%`;
      });
    };
  }
}