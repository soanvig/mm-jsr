export default class {
  constructor (callback) {
    this.callback = callback;
    this.enabled = true;
  }

  disable () {
    this.enabled = false;
  }

  enable () {
    this.enabled = true;
  }

  trigger (...args) {
    if (this.enabled) {
      this.callback(...args);
    }
  }
}