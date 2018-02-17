import { listenOn, findSameInArray } from '@/helpers';
import debounce from 'debounce';

export default function bindEvents () {
  const eventizer = this.modules.eventizer;
  const body = this.modules.renderer.body;

  // Slider
  listenOn(body.sliders, 'click', (event) => {
    event.stopPropagation();
  });
  listenOn(body.sliders, 'mousedown', (event) => {
    event.stopPropagation();

    this.temp.sliderInMove = parseInt(event.target.dataset.jsrId);
    this.temp.sliderClickX = event.clientX;

    const slidersWithSameValue = findSameInArray(this.values, this.temp.sliderInMove);
    if (slidersWithSameValue.length > 1) {
      this.temp.sliderInMove = slidersWithSameValue;
    }

    eventizer.trigger('view/slider:mousedown', event, slidersWithSameValue);
  });
  listenOn(document, 'mousemove', (event) => {
    event.stopPropagation();

    if (this.temp.sliderInMove === null) {
      return;
    }

    if (this.temp.sliderInMove instanceof Array) {
      // This situation means, that there is more than one slider in one position
      // Determine direction of move and select good slider
      if (event.clientX < this.temp.sliderClickX) {
        // Move to left, take first slider
        this.temp.sliderInMove = this.temp.sliderInMove[0];
      } else {
        // Move to right, take last slider
        this.temp.sliderInMove = this.temp.sliderInMove.pop();
      }
    }

    // Now, if its certain which slider should be move, focus it and make active!
    body.sliders[this.temp.sliderInMove].focus();
    body.sliders[this.temp.sliderInMove].classList.add('jsr_slider--active');

    // Calculate the difference between the position where slider was clicked and where the mouse cursor is now.
    // Plus convert it into rationed value.
    const diff = event.clientX - this.temp.sliderClickX;
    const diffRatio = diff / body.railOuter.offsetWidth;

    eventizer.trigger('view/slider:mousemove', event, this.temp.sliderInMove, diffRatio);
  });
  listenOn(document, 'mouseup', (event) => {
    if (this.temp.sliderInMove === null) {
      return;
    }

    // Clear active class on all sliders
    body.sliders.forEach((slider) => {
      slider.classList.remove('jsr_slider--active');
    });

    eventizer.trigger('view/slider:mouseup', event, this.temp.sliderInMove);
    this.temp.sliderInMove = null;
  });
  // ./ Slider

  // Rail
  listenOn(body.railOuter, 'mouseup', (event) => {
    if (this.temp.barIsMoved) {
      return;
    }

    const clickX = event.clientX;
    const railLeft = body.railOuter.getBoundingClientRect().left;
    const clickRelative = clickX - railLeft;
    const ratio = clickRelative / body.railOuter.offsetWidth;

    eventizer.trigger('view/rail:click', event, ratio);
  });
  // ./ Rail

  // Bar
  if (body.bars) {
    listenOn(body.bars, 'mousedown', (event) => {
      this.temp.barInMove = parseInt(event.target.dataset.jsrId);
      this.temp.barClickX = event.clientX;

      eventizer.trigger('view/bar:mousedown', event, this.temp.barInMove);
    });
    listenOn(document, 'mousemove', (event) => {
      if (this.temp.barInMove === null) {
        return;
      }

      this.temp.barIsMoved = true;

      // Calculate the difference between the position where bar was clicked and where the mouse cursor is now.
      // Plus convert it into rationed value.
      const diff = event.clientX - this.temp.barClickX;
      const diffRatio = diff / body.railOuter.offsetWidth;

      eventizer.trigger('view/bar:mousemove', event, this.temp.barInMove, diffRatio);
    });
    listenOn(document, 'mouseup', (event) => {
      if (this.temp.barInMove === null) {
        return;
      }

      eventizer.trigger('view/bar:mouseup', event, this.temp.barInMove);

      this.temp.barInMove = null;
      this.temp.barIsMoved = false;
    });
  }
  // ./ Bar

  // Keyboard
  listenOn(body.root, 'keydown', (event) => {
    // Its slider presumably, cuz only slider can have focus
    const sliderId = event.target.dataset.jsrId;
    const keyCodes = {
      '37': -1, // left
      '38': +1, // up
      '39': +1, // right
      '40': -1 // down
    };

    // If the left, up, down or right arrow was pressed
    const key = keyCodes[event.keyCode.toString()];
    if (!key) {
      return false;
    }

    // Prevent default, to disable functions like selecting text
    // Because of condition above it doesn't block other keys like TAB
    event.preventDefault();
    eventizer.trigger('view/root:arrow', event, sliderId, key);
  });
  // ./ Keyboard

  eventizer.register('view/slider:mousedown', (event, slidersId) => {
    this.logger.debug('JSR: Slider mousedown.');
    this.logger.debug(event);

    slidersId.forEach((slider) => {
      this.valueInMove[slider] = this.values[slider];
    });
  });

  eventizer.register('view/slider:mousemove',
    debounce((event, id, diff) => {
      this.logger.debug('JSR: Slider mousemove.');
      this.logger.debug(event);

      this._setValue(diff, id, true);
    }, 10)
  );

  eventizer.register('view/slider:mouseup', (event) => {
    this.logger.debug('JSR: Slider mouseup.');
    this.logger.debug(event);
  });

  eventizer.register('view/rail:click', (event, value) => {
    this.logger.debug('JSR: Rail clicked.');
    this.logger.debug(event);
    this._setValue(value);
  });

  eventizer.register('view/root:arrow', (event, id, direction) => {
    const actualValue = this.values[id];
    const twentiethRange = 0.05;
    const increaseBy = event.shiftKey ? twentiethRange
      : (event.ctrlKey ? this.stepRatio * 10 : this.stepRatio);

    const newValue = actualValue + increaseBy * direction;
    this._setValue(newValue, id);
  });

  eventizer.register('view/bar:mousedown', (event, id) => {
    this.logger.debug('JSR: Bar mousedown.');
    this.logger.debug(event);

    this.valueInMove[id] = this.values[id];
    this.valueInMove[id + 1] = this.values[id + 1];
  });

  eventizer.register('view/bar:mousemove',
    debounce((event, id, diff) => {
      this.logger.debug('JSR: Bar mousemove.');
      this.logger.debug(event);

      this._setValue(diff, id, true);
      this._setValue(diff, id + 1, true);
    }, 10)
  );

  eventizer.register('view/bar:mouseup', (event) => {
    this.logger.debug('JSR: Bar mouseup.');
    this.logger.debug(event);
  });
}