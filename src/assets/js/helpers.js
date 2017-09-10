const throttling = {};
function throttle (name, time, func) {
  if (throttling[name]) {
    return false;
  }

  throttling[name] = func;
  setTimeout(() => {
    throttling[name]();
    throttling[name] = false;
  }, time);
  return true;
}

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
  listenOn,
  throttle
};