module.exports = function (grunt) {
  // Rollup specific plugins
  const uglify = require('rollup-plugin-uglify');
  const babel = require('rollup-plugin-babel');
  const resolve = require('rollup-plugin-node-resolve');
  const commonjs = require('rollup-plugin-commonjs');
  const eslint = require('rollup-plugin-eslint');
  const uglifyES = require('uglify-es');

  const paths = {
    source: 'src/',
    buildTarget: 'dist/',
    public: 'public/',
    temp: '.tmp/'
  }

  const config = {
    browserSync: {
      dev: {
        browser: 'firefox',
        bsFiles: {
          src: [
            paths.public + '**/*',
            paths.temp + '**/*'
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
      },
      js: {
        src: [
          paths.buildTarget + 'main.js'
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
          filter: (path) => {
            path = path.split('/');
            const lastPart = path[path.length - 1];
            return lastPart.charAt(0) !== '_';
          }
        }]
      },
      dist: {
        options: {
          pretty: true
        },
        files: [{
          expand: true,
          cwd: paths.source + 'assets/pug',
          src: ['**/*.pug'],
          dest: paths.buildTarget,
          ext: '.html',
          extDot: 'first',
          filter: (path) => {
            path = path.split('/');
            const lastPart = path[path.length - 1];
            return lastPart.charAt(0) !== '_';
          }
        }]
      }
    },

    rollup: {
      options: {
        format: 'umd',
        moduleName: 'JSR'
      },
      dev: {
        files: [{
          'src': paths.source + 'assets/js/main.js',
          'dest': paths.temp + 'main.js'
        }],
        options: {
          plugins: () => {
            return [
              eslint({
                throwOnError: true
              }),
              resolve({
                jsnext: true,
                main: true,
                browser: true
              }),
              commonjs()
            ];
          },
          sourceMap: 'inline'
        }
      },
      dist: {
        options: {
          plugins: () => {
            return [
              resolve({
                jsnext: true,
                main: true,
                browser: true
              }),
              commonjs(),
              // babel({
              //   exclude: './node_modules/**'
              // }),
              uglify({}, uglifyES.minify)
            ];
          },
          sourceMap: false
        },

        files: [{
          'src': paths.source + 'assets/js/main.js',
          'dest': paths.buildTarget + 'main.js'
        }],
      }
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
  grunt.loadNpmTasks('grunt-rollup');

  grunt.registerTask('dev', ['rollup:dev', 'sass:dev', 'pug:dev', 'browserSync', 'watch']);
  grunt.registerTask('dist', ['clean:dist', 'mkdir:dist', 'copy:dist', 'sass:dist', 'pug:dist', 'rollup:dist']);
};