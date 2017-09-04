const body = {};
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

function createElement (elName) {
  const structEl = bodyStructure[elName];
  const count = structEl.count;
  const createdElements = [];

  if (count <= 0) {
    return createdElements;
  } else {
    body[elName] = body[elName] || [];
    for (let i = 0; i < count; i += 1) {
      const el = document.createElement('div');
      el.classList.add(...structEl.classes);
      body[elName].push(el);
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
        const children = createElement(childName);
        // And for each child created
        children.forEach((child) => {
          // Add it to parent
          body[elName][i].appendChild(child);
        });
      }
    });
  }

  return createdElements;
}

/* Flattens body (if there is only one element, make it no-array) */
function flattenBody() {
  for (const elName in body) {
    if (body[elName].length === 1) {
      body[elName] = body[elName][0];
    }
  }
}

function bindEvents(eventizer) {
  eventizer.register('view/slider:click', (event) => {
    console.log('Slider clicked');
  });
}

export default {
  build ({ modules }) {
    // Create body starting from root
    const eventizer = modules.eventizer;
    
    createElement('root');
    flattenBody();
    bindEvents(eventizer);
  }
};