// Handle binding events even if multiple elements */
function attachEventListener (element, event, callback) {
  element.addEventListener(event, callback);
}
// ./

function listenOn (elements, event, callback) {
  if (elements instanceof Array) {
    elements.forEach((element) => {
      // If it's array inside array do recursive
      if (element instanceof Array) {
        listenOn(element, event, callback);
      } else {
        attachEventListener(element, event, callback);
      }
    });
  } else {
    attachEventListener(elements, event, callback);
  }
}

export default listenOn;