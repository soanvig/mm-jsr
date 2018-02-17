module.exports = {
  dev: {
    bsFiles: {
      src: [
        `${config.paths.public}/**/*`,
        `${config.paths.temp}/**/*`
      ]
    },
    options: {
      watchTask: true,
      server: [
        config.paths.source,
        config.paths.temp
      ]
    }
  }
};