module.exports = {
  dist: {
    files: [
      {
        expand: true,
        cwd: config.paths.source,
        src: ['*.html'],
        dest: config.paths.buildTarget
      },
      {
        expand: true,
        cwd: config.paths.source,
        src: ['*.css'],
        dest: `${config.paths.buildTarget}/assets/css`
      }
    ]
  }
};