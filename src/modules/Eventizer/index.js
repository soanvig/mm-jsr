import Event from './Event';

class Eventizer {
  constructor () {
    this.store = {};
  }

  /* Adds new events store (store === event name) */
  _createNewStore (name) {
    if (this.store[name]) {
      return;
    }

    this.store[name] = [];
  }

  /* Adds new event to existing store */
  _addListener (name, callback) {
    this._createNewStore(name);
    const event = new Event(callback);
    this.store[name].push(event);
    return event;
  }

  /* Triggers all events in store */
  _dispatchEvent (name, ...args) {
    if (!this.store[name]) {
      return false;
    }

    const length = this.store[name].length;
    for (let i = 0; i < length; i += 1) {
      this.store[name][i].trigger(...args);
    }
  }

  /* API */
  register (name, callback) {
    return this._addListener(name, callback);
  }

  trigger (name, ...args) {
    this._dispatchEvent(name, ...args);
  }
}

export default {
  name: 'eventizer',
  Klass: Eventizer
};