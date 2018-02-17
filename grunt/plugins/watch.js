module.exports = {
  js: {
    files: `${config.paths.source}/**/*.js`,
    tasks: ['rollup:dev']
  }
};