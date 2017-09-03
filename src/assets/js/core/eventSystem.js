import Event from './event.js';

export default {
  _events: {},

  _createNewEvent (name) {
    if (this._events[name]) {
      return;
    }

    this._events[name] = [];
  },

  _addListener (name, callback) {
    const event = new Event(this, callback);
    this._events[name].push(event);
    return event;
  },

  _dispatchEvent (name, ...args) {
    if (!this._events[name]) {
      return false;
    }

    const length = this._events[name].length;
    for (let i = 0; i < length; i += 1) {
      this._events[name][i].trigger(...args);
    }
  },

  /* Public */
  register (name, callback) {
    this._createNewEvent(name);
    return this._addListener(name, callback);
  },
  trigger (name, ...args) {
    this._dispatchEvent(name, ...args);
  }
};