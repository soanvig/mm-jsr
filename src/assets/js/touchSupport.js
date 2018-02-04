import { listenOn } from './helpers.js';

class TouchSupport {
  _bindEvents () {
    const elements = [this.modules.renderer.body.sliders];
    if (this.modules.renderer.body.labels) {
      elements.push(this.modules.renderer.body.labels);
    }

    listenOn(elements, 'touchstart', (event) => {
      document.documentElement.classList.add('jsr_lockscreen');

      event = event.targetTouches.item(0);
      const mouseEvent = new MouseEvent('mousedown', event);
      this.modules.renderer.body.sliders[event.target.dataset.jsrId].dispatchEvent(mouseEvent);
    });

    listenOn(elements, 'touchmove', (event) => {
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

export default {
  name: 'touchSupport',
  Klass: TouchSupport
};