let level = 0;
const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  disable: 4
};

export default {
  setLevel (levelName) {
    level = levels[levelName];
  },

  debug (...args) {
    if (level > 0) {
      return;
    }

    console.log(...args);
  },

  log (...args) {
    if (level > 1) {
      return;
    }

    console.log(...args);
  },

  info (...args) {
    if (level > 1) {
      return;
    }

    console.info(...args);
  },
  
  warn (...args) {
    if (level > 2) {
      return;
    }

    console.warn(...args);
  },

  error (...args) {
    if (level > 3) {
      return;
    }

    console.error(...args);
  }
};