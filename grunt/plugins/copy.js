module.exports = {
  dist: {
    files: [
      {
        expand: true,
        cwd: config.paths.source,
        src: ['*.css', '*.html'],
        dest: config.paths.buildTarget
      }
    ]
  }
};