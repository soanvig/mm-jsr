module.exports = {
  styles: {
    files: `${config.paths.source}/assets/scss/**/*.scss`,
    tasks: ['sass:dev']
  },
  templates: {
    files: `${config.paths.source}/assets/pug/**/*.pug`,
    tasks: ['pug:dev']
  },
  js: {
    files: `${config.paths.source}/assets/js/**/*.js`,
    tasks: ['rollup:dev']
  }
};