import structureParser from './structureParser.js';
import { listenOn } from '../helpers.js';

const data = {
  modules: null,
  eventsLoaded: false,
  sliderInMove: null
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
    children: ['sliders', 'ranges'],
    count: 1
  },
  sliders: {
    classes: ['jsr_slider'],
    children: [],
    count: 2
  },
  ranges: {
    classes: ['jsr_range'],
    children: [],
    count: 1
  }
};

function bindEvents (eventizer) {
  // Slider
  listenOn(body.sliders, 'click', (event) => {
    event.stopPropagation();
  });
  listenOn(body.sliders, 'mousedown', (event) => {
    // TODO: determine, how the slider id should be retrieved.
    data.sliderInMove = 0;
    eventizer.trigger('view/slider:mousedown', event);
  });
  listenOn(document, 'mousemove', (event) => {
    if (data.sliderInMove !== null) {
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
}

export default {
  build ({ modules }) {
    // Create body starting from root
    data.modules = modules || data.modules;
    const eventizer = data.modules.eventizer;
    
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

    console.log(`JSR: Slider no. ${sliderNum} set to value: ${value}.`);

    slider.style.left = left;
  }
};