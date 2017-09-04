import Event from './event.js';

const events = {};

function createNewEvent (name) {
  if (events[name]) {
    return;
  }

  events[name] = [];
}

function addListener (name, callback) {
  const event = new Event(callback);
  events[name].push(event);
  return event;
}

function dispatchEvent (name, ...args) {
  if (!events[name]) {
    return false;
  }

  const length = events[name].length;
  for (let i = 0; i < length; i += 1) {
    events[name][i].trigger(...args);
  }
}

export default {
  register (name, callback) {
    createNewEvent(name);
    return ddListener(name, callback);
  },
  trigger (name, ...args) {
    dispatchEvent(name, ...args);
  }
};