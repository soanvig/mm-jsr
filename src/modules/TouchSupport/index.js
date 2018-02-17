import { listenOn } from '@/helpers';

class TouchSupport {
  _bindEvents () {
    const body = this.modules.renderer.body;

    listenOn(body.root, 'touchstart', (event) => {
      document.documentElement.classList.add('jsr_lockscreen');
      
      event = event.targetTouches.item(0);
      event.bubbles = true;
      event.cancelable = true;
      const mouseEvent = new MouseEvent('mousedown', event);
      event.target.dispatchEvent(mouseEvent);
    });

    listenOn(document, 'touchmove', (event) => {
      event = event.targetTouches.item(0);
      event.bubbles = true;
      event.cancelable = true;
      const mouseEvent = new MouseEvent('mousemove', event);
      event.target.dispatchEvent(mouseEvent);
    });

    listenOn(document, 'touchend', (event) => {
      document.documentElement.classList.remove('jsr_lockscreen');
      
      event = event.changedTouches.item(0);
      event.bubbles = true;
      event.cancelable = true;
      const mouseEvent = new MouseEvent('mouseup', event);
      event.target.dispatchEvent(mouseEvent);
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