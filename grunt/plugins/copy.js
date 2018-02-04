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
        src: ['assets/images/**'],
        dest: config.paths.buildTarget
      },
      {
        expand: true,
        cwd: config.paths.source,
        src: ['assets/fonts/**'],
        dest: config.paths.buildTarget
      },
      {
        expand: true,
        cwd: config.paths.source,
        src: ['assets/plugins/**'],
        dest: config.paths.buildTarget
      },
      {
        expand: true,
        cwd: config.paths.public,
        src: ['**/*'],
        dest: config.paths.buildTarget
      }
    ]
  }
};