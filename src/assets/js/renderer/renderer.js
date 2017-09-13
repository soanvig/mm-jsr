import structureParser from './structureParser.js';
import { listenOn } from '../helpers.js';

const defaultBodyStructure = {
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

/* Private methods. Require to be called with .call(this, ...args) */

// Returns ids of sliders with the same value as slider with sliderNum id
function getSlidersWithSameValue (sliderNum) {
  const sliders = [];

  this.values.forEach((value, index) => {
    if (value === this.values[sliderNum]) {
      sliders.push(index);
    }
  });

  return sliders;
}

export default class {
  constructor () {
    // This lists all available in-object variables
    this.logger = null;
    this.config = {};
    this.modules = {};
    this.sliderInMove = null;
    this.sliderClickX = 0;
    this.values = [];
    this.body = {};
    this.bodyStructure = defaultBodyStructure;
  }

  _bindEvents () {
    const eventizer = this.modules.eventizer;
    
    // Slider
    listenOn(this.body.sliders, 'click', (event) => {
      event.stopPropagation();
    });
    listenOn(this.body.sliders, 'mousedown', (event) => {
      this.sliderInMove = event.target.dataset.jsrId;
      this.sliderClickX = event.clientX;

      eventizer.trigger('view/slider:mousedown', event, this.sliderInMove);

      const slidersWithSameValue = getSlidersWithSameValue.call(this, this.sliderInMove);
      if (slidersWithSameValue.length > 1) {
        this.sliderInMove = slidersWithSameValue;
      }
    });
    listenOn(document, 'mousemove', (event) => {
      if (this.sliderInMove !== null) {
        if (this.sliderInMove instanceof Array) {
          // This situation means, that there is more than one slider in one position
          // Determine direction of move and select good slider
          if (event.clientX < this.sliderClickX) {
            // Move to left, take first slider
            this.sliderInMove = this.sliderInMove[0];
          } else {
            // Move to right, take last slider
            this.sliderInMove = this.sliderInMove[this.sliderInMove.length - 1];
          }
        }

        const diff = event.clientX - this.sliderClickX;
        const diffRatio = diff / this.body.railOuter.offsetWidth;

        eventizer.trigger('view/slider:mousemove', event, this.sliderInMove, diffRatio);
      }
    });
    listenOn(document, 'mouseup', (event) => {
      if (this.sliderInMove !== null) {
        eventizer.trigger('view/slider:mouseup', event, this.sliderInMove);
        this.sliderInMove = null;
      }
    });
    // ./ Slider

    // Bar
    // listenOn(this.body.bars, 'mousedown', (event) => {
      
    // });
    // listenOn(document, 'mousemove', (event) => {
      
    // });
    // listenOn(document, 'mouseup', (event) => {
      
    // });
    // ./ Bar
  
    // Rail
    listenOn(this.body.railOuter, 'click', (event) => {
      const clickX = event.clientX;
      const railLeft = this.body.railOuter.getBoundingClientRect().left;
      const clickRelative = clickX - railLeft;
      const ratio = clickRelative / this.body.railOuter.offsetWidth;
  
      eventizer.trigger('view/rail:click', event, ratio);
    });
    // ./ Rail
  
    // Keyboard
    listenOn(this.body.root, 'keydown', (event) => {
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
  }

  // Updates bars which are neighbour to sliderNum (value is this slider value).
  _updateBars (sliderNum, value) {
    if (!this.body.bars) {
      return;
    }
  
    const leftBar = this.body.bars[sliderNum - 1];
    const rightBar = this.body.bars[sliderNum];
  
    if (leftBar) {
      leftBar.style.right = `${(1 - value) * 100}%`;
    }
  
    if (rightBar) {
      rightBar.style.left = `${value * 100}%`;
    }
  }

  /* API */
  build ({ modules, logger, config }) {
    this.modules = modules;
    this.logger = logger;
    this.config = config;

    this.bodyStructure.sliders.count = this.config.sliders || 1;
    this.bodyStructure.bars.count = this.bodyStructure.sliders.count - 1;
    
    // Create body starting from root
    this.body = structureParser(this.bodyStructure, 'root');

    this._bindEvents();
  }

  get structure () {
    return this.bodyStructure;
  }

  // Appends root after target
  // @target should be HTML element
  appendRoot (target) {
    target.parentNode.insertBefore(this.body.root, target.nextSibling);
  }

  setSliderValue (value, sliderNum) {
    const slider = this.body.sliders[sliderNum];
    const left = `calc(${value * 100}% - ${slider.offsetWidth}px / 2)`;

    this.logger.debug(`JSR: Slider no. ${sliderNum} set to value: ${value}.`);

    this.values[sliderNum] = value;
    slider.style.left = left;

    this._updateBars(sliderNum, value);
  }
}