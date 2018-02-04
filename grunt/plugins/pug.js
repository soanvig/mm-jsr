module.exports = {
  dev: {
    options: {
      pretty: true
    },
    files: [
      {
        expand: true,
        cwd: `${config.paths.source}/assets/pug`,
        src: ['**/*.pug'],
        dest: config.paths.temp,
        ext: '.html',
        extDot: 'first',
        filter: (path) => {
          path = path.split('/');
          const lastPart = path[path.length - 1];
          return lastPart.charAt(0) !== '_';
        }
      }
    ]
  },
  dist: {
    options: {
      pretty: true
    },
    files: [
      {
        expand: true,
        cwd: `${config.paths.source}/assets/pug`,
        src: ['**/*.pug'],
        dest: config.paths.buildTarget,
        ext: '.html',
        extDot: 'first',
        filter: (path) => {
          path = path.split('/');
          const lastPart = path[path.length - 1];
          return lastPart.charAt(0) !== '_';
        }
      }
    ]
  }
};