module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-rollup');

  global.config = require('./config');

  const pluginsConfig = {};

  pluginsConfig.browserSync = require('./plugins/browserSync');
  pluginsConfig.watch = require('./plugins/watch');
  pluginsConfig.clean = require('./plugins/clean');
  pluginsConfig.mkdir = require('./plugins/mkdir');
  pluginsConfig.copy = require('./plugins/copy');
  pluginsConfig.rollup = require('./plugins/rollup');

  grunt.initConfig(pluginsConfig);

  const dev = [
    'rollup:dev',
    'browserSync:dev',
    'watch'
  ];

  const dist = [
    'clean:dist',
    'mkdir:dist',
    'copy:dist',
    'rollup:dist'
  ];

  grunt.registerTask('dev', dev);
  grunt.registerTask('dist', dist);
  grunt.registerTask('build', dist);
};