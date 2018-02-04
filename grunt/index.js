module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-version-assets');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-rollup');

  global.config = require('./config');

  const pluginsConfig = {};

  pluginsConfig.browserSync = require('./plugins/browserSync');
  pluginsConfig.watch = require('./plugins/watch');
  pluginsConfig.clean = require('./plugins/clean');
  pluginsConfig.mkdir = require('./plugins/mkdir');
  pluginsConfig.copy = require('./plugins/copy');
  pluginsConfig.sass = require('./plugins/sass');
  pluginsConfig.versioning = require('./plugins/versioning');
  pluginsConfig.pug = require('./plugins/pug');
  pluginsConfig.rollup = require('./plugins/rollup');

  grunt.initConfig(pluginsConfig);

  grunt.registerTask(
    'dev',
    [
      'rollup:dev',
      'sass:dev',
      'pug:dev',
      'browserSync:dev',
      'watch'
    ]
  );
  grunt.registerTask(
    'dist',
    [
      'clean:dist',
      'mkdir:dist',
      'copy:dist',
      'sass:dist',
      'pug:dist',
      'rollup:dist'
    ]
  );
};