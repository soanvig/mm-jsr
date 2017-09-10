function createElement (elName, bodyStructure, body) {
  const structEl = bodyStructure[elName];
  const count = structEl.count;
  const createdElements = [];

  if (count <= 0) {
    return createdElements;
  }

  body[elName] = body[elName] || [];
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement('div');
    el.classList.add(...structEl.classes);
    body[elName].push(el);
    createdElements.push(el);
  }

  // If there is any child
  if (structEl.children.length > 0) {
    // For each child name
    structEl.children.forEach((childName) => {
      // And for each parent
      for (let i = 0; i < count; i += 1) {
        // Create `child.count` children
        const children = createElement(childName, bodyStructure, body);
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
function flattenBody (body) {
  for (const elName in body) {
    if (body[elName].length === 1) {
      body[elName] = body[elName][0];
    }
  }
}

export default function (structure, element) {
  const body = {};
  createElement(element, structure, body);
  flattenBody(body);

  return body;
}