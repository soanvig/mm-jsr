export default {
  body: {},

  bodyStructure: {
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
  },

  _createBody (elName) {
    const structEl = this.bodyStructure[elName];
    const count = structEl.count;
    const createdElements = [];

    if (count <= 0) {
      return createdElements;
    } else {
      this.body[elName] = this.body[elName] || [];
      for (let i = 0; i < count; i += 1) {
        const el = document.createElement('div');
        el.classList.add(...structEl.classes);
        this.body[elName].push(el);
        createdElements.push(el);
      }
    }

    // If there is any child
    if (structEl.children.length > 0) {
      // For each child name
      structEl.children.forEach((childName) => {
        // And for each parent
        for (let i = 0; i < count; i += 1) {
          // Create `child.count` children
          const children = this._createBody(childName);
          // And for each child created
          children.forEach((child) => {
            // Add it to parent
            this.body[elName][i].appendChild(child);
          });
        }
      });
    }

    return createdElements;
  },

  /* Flattens body (if there is only one element, make it no-array) */
  _flattenBody() {
    for (const elName in this.body) {
      if (this.body[elName].length === 1) {
        this.body[elName] = this.body[elName][0];
      }
    }
  },

  /* Public */
  build () {
    // Create body strating from root
    this._createBody('root');
    this._flattenBody();
  }
};