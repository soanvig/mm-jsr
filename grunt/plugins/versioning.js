module.exports = {
  options: {
    grepFiles: [`${config.paths.buildTarget}/'**/*.html`],
    keepOriginal: false
  },
  css: {
    src: [`${config.paths.buildTarget}/'assets/css/*.css`]
  },
  js: {
    src: [`${config.paths.buildTarget}/'main.js`]
  }
};