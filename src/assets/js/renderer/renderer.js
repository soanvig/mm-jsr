import structureParser from './structureParser.js';
import { listenOn } from '../helpers.js';

let logger = null;

const data = {
  modules: null,
  eventsLoaded: false,
  sliderInMove: null,
  values: []
};

let body = {};
const bodyStructure = {
  root: {
    classes: ['jsr'],
    children: ['railOuter'],
    count: 1
  },
  railOuter: {
    classes: ['jsr_rail-outer'],
    children: ['rail'],
    count: 1
  },
  rail: {
    classes: ['jsr_rail'],
    children: ['sliders', 'bars'],
    count: 1
  },
  sliders: {
    classes: ['jsr_slider'],
    children: [],
    attributes: {
      tabindex: 0
    },
    count: 2,
    alwaysArray: true
  },
  bars: {
    classes: ['jsr_bar'],
    children: [],
    count: 1,
    alwaysArray: true
  }
};

function getSlidersWithSameValue (sliderNum) {
  const sliders = [];

  data.values.forEach((value, index) => {
    if (value === data.values[sliderNum]) {
      sliders.push(index);
    }
  });

  return sliders;
}

function bindEvents (eventizer) {
  // Slider
  listenOn(body.sliders, 'click', (event) => {
    event.stopPropagation();
  });
  listenOn(body.sliders, 'mousedown', (event) => {
    data.sliderInMove = event.target.dataset.jsrId;
    const slidersWithSameValue = getSlidersWithSameValue(data.sliderInMove);
    if (slidersWithSameValue.length > 1) {
      data.sliderInMove = slidersWithSameValue;
      data.sliderClickX = event.clientX;
    }
    eventizer.trigger('view/slider:mousedown', event);
  });
  listenOn(document, 'mousemove', (event) => {
    if (data.sliderInMove !== null) {
      if (data.sliderInMove instanceof Array) {
        // This situation means, that there is more than one slider in one position
        // Determine direction of move and select good slider
        if (event.clientX < data.sliderClickX) {
          // Move to left, take first slider
          data.sliderInMove = data.sliderInMove[0];
        } else {
          // Move to right, take last slider
          data.sliderInMove = data.sliderInMove[data.sliderInMove.length - 1];
        }
      }

      const clientX = event.clientX;
      const railLeft = body.railOuter.getBoundingClientRect().left;
      const clickRelative = clientX - railLeft;
      const ratio = clickRelative / body.railOuter.offsetWidth;
      
      event.data = {
        clickRelative,
        ratio
      };
      eventizer.trigger('view/slider:mousemove', event, data.sliderInMove);
    }
  });
  listenOn(document, 'mouseup', (event) => {
    if (data.sliderInMove !== null) {
      eventizer.trigger('view/slider:mouseup', event, data.sliderInMove);
      data.sliderInMove = null;
    }
  });

  // Rail click
  listenOn(body.railOuter, 'click', (event) => {
    const clickX = event.clientX;
    const railLeft = body.railOuter.getBoundingClientRect().left;
    const clickRelative = clickX - railLeft;
    const ratio = clickRelative / body.railOuter.offsetWidth;

    event.data = {
      clickRelative,
      ratio
    };
    eventizer.trigger('view/rail:click', event);
  });

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
}

function updateBars (sliderNum, value) {
  const leftBar = body.bars[sliderNum - 1];
  const rightBar = body.bars[sliderNum];

  if (leftBar) {
    leftBar.style.right = `${(1 - value) * 100}%`;
  }

  if (rightBar) {
    rightBar.style.left = `${value * 100}%`;
  }
}

export default {
  build ({ modules, log }) {
    // Create body starting from root
    data.modules = modules || data.modules;
    const eventizer = data.modules.eventizer;
    logger = log;
    
    body = structureParser(bodyStructure, 'root');

    if (!data.eventsLoaded) {
      bindEvents(eventizer);
    }
  },
  
  structure () {
    return bodyStructure;
  },

  update () {
    this.build();
  },

  appendRoot (target) {
    target = document.querySelector(target);
    target.appendChild(body.root);
  },

  setSliderValue (sliderNum, value) {
    const slider = body.sliders[sliderNum];
    const left = `calc(${value * 100}% - ${slider.offsetWidth}px / 2)`;

    logger.debug(`JSR: Slider no. ${sliderNum} set to value: ${value}.`);

    data.values[sliderNum] = value;
    slider.style.left = left;

    updateBars(sliderNum, value);
  }
};