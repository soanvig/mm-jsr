module.exports = {
  dev: {
    options: {
      style: 'expanded'
    },
    files: {
      [`${config.paths.temp}/assets/css/main.css`]: `${config.paths.source}/assets/scss/main.scss`
    }
  },
  dist: {
    options: {
      style: 'compressed',
      sourcemap: 'none'
    },
    files: {
      [`${config.paths.buildTarget}/assets/css/main.css`]: `${config.paths.source}/assets/scss/main.scss`
    }
  },
};