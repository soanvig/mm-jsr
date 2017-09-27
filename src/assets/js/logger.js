const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  disable: 4
};

export default class {
  constructor () {
    this.level = 1;
  }

  setLevel (levelName) {
    this.level = levels[levelName];
  }

  debug (...args) {
    if (this.level > 0) {
      return;
    }

    console.log(...args);
  }

  log (...args) {
    if (this.level > 1) {
      return;
    }

    console.log(...args);
  }

  info (...args) {
    if (this.level > 1) {
      return;
    }

    console.info(...args);
  }
  
  warn (...args) {
    if (this.level > 2) {
      return;
    }

    console.warn(...args);
  }

  error (...args) {
    if (this.level > 3) {
      return;
    }

    console.error(...args);
  }
}