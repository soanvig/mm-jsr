export default {
  body: {},

  bodyClasses: {
    parent: ['jsr'],
    railOuter: ['jsr_rail-outer'],
    rail: ['jsr_rail'],
    sliders: ['jsr_slider'],
    ranges: ['jsr_range']
  },

  bodyStructure: {
    root: {
      element: 'parent',
      children: ['railOuter']
    },
    railOuter: {
      children: ['rail']
    },
    rail: {
      children: ['sliders', 'ranges']
    }
  },

  /* 
   * Integer indicates number of specific elements
   * These elements will be inserted into this.body
   * Works like an object (function is used to calculate number of ranges)
   */
  bodyElements: new function () {
    this.parent = 1;
    this.railOuter = 1;
    this.rail = 1;
    this.sliders = 2;
    this.ranges = this.sliders - 1;
  },

  /*
   * parent (outer cointainer, which enables positioning around other elements)
   * --- railOuter (container for rail)
   * --- --- rail (rail itself, contains rail background and sliders)
   * --- --- --- sliders (usually round buttons placed on slider)
   * --- --- --- ranges
   */
  _createBody () {
    for (const bodyElement in this.bodyElements) {
      const number = this.bodyElements[bodyElement];

      if (number <= 0) {
        continue;
      } else if (number === 1) {
        this.body[bodyElement] = document.createElement('div');
      } else {
        this.body[bodyElement] = [];
        for (let i = 0; i < number; i += 1) {
          this.body[bodyElement].push(document.createElement('div'));
        }
      }
    }

    this._parseStructure({
      body: this.body,
      structure: this.bodyStructure,
      target: null, // null because root
      targetName: null, // null because root
      root: true
    });

    this._appendClasses(this.body, this.bodyClasses);
  },

  /*
   * body - source of elements
   * structure - source of other structures
   * target - target element to append children to
   * targetStructure - structure of target element (to retrieve children)
   */
  _parseStructure ({ body, structure, target, targetName, root = false }) {
    if (root) {
      target = body[structure.root.element];
      targetName = 'root';
    }

    if (!structure[targetName]) {
      // Stop execution when target has no structure defined
      return;
    }

    const childrenNames = structure[targetName].children;
    childrenNames.forEach((childName) => {
      if (!body[childName]) {
        return;
      }

      // Add child to parent
      const children = [].concat(body[childName]); // Ensures array
      children.forEach((child) => {
        target.appendChild(child);
        
        // Parse children
        this._parseStructure({
          body,
          structure,
          target: child,
          targetName: childName
        });
      });
    });
  },

  _appendClasses (body, classes) {
    /* 
     * bodyEl contains 'parent', 'rail', etc
     * element contains HTML element
     * klass contains single class from classlist
     */
    
    for (const bodyEl in body) {
      if (classes[bodyEl]) {
        const elementsArray = [].concat(body[bodyEl]); // Ensures it's an array

        elementsArray.forEach((element) => {
          const klasses = classes[bodyEl];
          element.classList.add(...klasses); // Destruct array into strings params
        });
      }
    }
  },

  /* Public */
  build () {
    this._createBody();
  }
};