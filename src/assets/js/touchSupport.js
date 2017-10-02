import { listenOn } from './helpers.js';

export default class {
  _bindEvents () {
    listenOn([this.modules.renderer.body.sliders, this.modules.renderer.body.labels], 'touchstart', (event) => {
      document.documentElement.classList.add('jsr_lockscreen');

      event = event.targetTouches.item(0);
      const mouseEvent = new MouseEvent('mousedown', event);
      this.modules.renderer.body.sliders[event.target.dataset.jsrId].dispatchEvent(mouseEvent);
    });

    listenOn([this.modules.renderer.body.sliders, this.modules.renderer.body.labels], 'touchmove', (event) => {
      event = event.targetTouches.item(0);
      const mouseEvent = new MouseEvent('mousemove', event);
      document.dispatchEvent(mouseEvent);
    });

    listenOn(document, 'touchend', (event) => {
      document.documentElement.classList.remove('jsr_lockscreen');
      
      event = event.targetTouches.item(0);
      const mouseEvent = new MouseEvent('mouseup', event);
      document.dispatchEvent(mouseEvent);
    });
  }

  /* API */
  build ({ config, modules, logger }) {
    this.logger = logger;
    this.config = config;
    this.modules = modules;

    this._bindEvents();
  }
}