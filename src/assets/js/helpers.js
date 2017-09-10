// Handle binding events even if multiple elements */
function attachEventListener (element, event, callback) {
  element.addEventListener(event, callback);
}
// ./

function listenOn (elements, event, callback) {
  if (elements instanceof Array) {
    elements.forEach((element) => {
      attachEventListener(element, event, callback);
    });
  } else {
    attachEventListener(elements, event, callback);
  }
}

export {
  listenOn
};