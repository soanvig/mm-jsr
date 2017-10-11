const throttling = {};
function throttle (name, time, func) {
  if (throttling[name]) {
    return false;
  }

  throttling[name] = func;
  throttling[name]();
  setTimeout(() => {
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

// Determines, how many decimal places the (float) number has
function calculateDecimals (number) {
  const string = number.toString().split('.');
  if (string[1]) {
    return string[1].length;
  }

  return 0;
}

export {
  listenOn,
  throttle,
  calculateDecimals
};