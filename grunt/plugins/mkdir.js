module.exports = {
  dist: {
    options: {
      create: [
        `${config.paths.buildTarget}/assets/css`,
        `${config.paths.buildTarget}/assets/fonts`,
        `${config.paths.buildTarget}/assets/images`,
        `${config.paths.buildTarget}/assets/plugins`
      ]
    }
  }
};