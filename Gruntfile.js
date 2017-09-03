module.exports = function (grunt) {
  // Rollup specific plugins
  var uglify = require('rollup-plugin-uglify');
  var babel = require('rollup-plugin-babel');

  var paths = {
    source: 'src/',
    buildTarget: 'dist/',
    public: 'public/',
    temp: '.tmp/'
  }

  var config = {
    browserSync: {
      dev: {
        browser: 'firefox',
        bsFiles: {
          src : [
            paths.source + '**/*.css',
            paths.source + '**/*.html',
            paths.source + '**/*.js'
          ]
        },
        options: {
          watchTask: true,
          server: [paths.source, paths.public, paths.temp]
        }
      }
    },

    watch: {
      styles: {
        files: paths.source + 'assets/scss/**/*.scss',
        tasks: ['sass:dev']
      },
      templates: {
        files: paths.source + 'assets/pug/**/*.pug',
        tasks: ['pug:dev']
      },
      js: {
        files: paths.source + 'assets/js/**/*.js',
        tasks: ['rollup:dev']
      }
    },

    clean: {
      dist: {
        src: [paths.buildTarget + '**/*']
      }
    },

    mkdir: {
      dist: {
        options: {
          create: [
            paths.buildTarget + 'assets/css',
            paths.buildTarget + 'assets/fonts',
            paths.buildTarget + 'assets/images',
            paths.buildTarget + 'assets/plugins'
          ]
        }
      }
    },

    copy: {
      dist: {
        files: [
          { expand: true, cwd: paths.source, src: ['*.html'], dest: paths.buildTarget },
          { expand: true, cwd: paths.source, src: ['assets/images/**'], dest: paths.buildTarget },
          { expand: true, cwd: paths.source, src: ['assets/fonts/**'], dest: paths.buildTarget },
          { expand: true, cwd: paths.source, src: ['assets/plugins/**'], dest: paths.buildTarget },
          { expand: true, cwd: paths.public, src: ['**/*'], dest: paths.buildTarget }
        ]
      }
    },

    sass: {
      dev: {
        options: {
          style: 'expanded'
        },
        // Defined later
        files: {}
      },
      dist: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {}
      },
    },

    versioning: {
      options: {
        grepFiles: [
          paths.buildTarget + '**/*.html',
        ],
        keepOriginal: false
      },
      css: {
        src: [
          paths.buildTarget + 'assets/css/*.css'
        ]
      }
    },

    pug: {
      dev: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: paths.source + 'assets/pug',
          src: ['**/*.pug'],
          dest: paths.temp,
          ext: '.html',
          extDot: 'first',
          filter: function (path) {
            path = path.split('/');
            let lastPart = path[path.length - 1];
            return lastPart.charAt(0) !== '_';
          }
        }]
      },
      dist: {
        options: {},
        files: [{
          expand: true,
          cwd: paths.source + 'assets/pug',
          src: ['**/*.pug'],
          dest: paths.buildTarget,
          ext: '.html',
          extDot: 'first',
          filter: function (path) {
            path = path.split('/');
            let lastPart = path[path.length - 1];
            return lastPart.charAt(0) !== '_';
          }
        }]
      }
    },

    rollup: {
      options: {
        format: 'iife',
        sourceMap: 'inline'
      },
      dev: {
        files: [{
          'src': paths.source + 'assets/js/main.js',
          'dest': paths.temp + 'main.js'
        }]
      },
      dist: {
        options: {
          plugins: function() {
            return [
              babel({
                exclude: './node_modules/**'
              }),
              uglify()
            ];
          }
        },

        files: [{
          'src': paths.source + 'assets/js/main.js',
          'dest': paths.buildTarget + 'main.js'
        }],
      }
    },

    eslint: {
      src: [paths.source + 'assets/js/**/*.js']
    }
  }

  config.sass.dev.files[paths.temp + 'assets/css/main.css'] = paths.source + 'assets/scss/main.scss';
  config.sass.dist.files[paths.buildTarget + 'assets/css/main.css'] = paths.source + 'assets/scss/main.scss';

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-version-assets');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-rollup');
 
  grunt.registerTask('dev', ['sass:dev', 'pug:dev', 'rollup:dev', 'browserSync', 'watch']);
  grunt.registerTask('dist', ['eslint', 'clean:dist', 'mkdir:dist', 'copy:dist', 'sass:dist', 'pug:dist', 'rollup:dist', 'versioning']);
};