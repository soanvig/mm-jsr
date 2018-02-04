const uglify = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const uglifyES = require('uglify-es');

module.exports = {
  options: {
    format: 'umd',
    moduleName: 'JSR'
  },
  dev: {
    files: [
      {
        'src': `${config.paths.source}/assets/js/main.js`,
        'dest': `${config.paths.temp}/main.js`
      }
    ],
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

    files: [
      {
        'src': `${config.paths.source}/assets/js/main.js`,
        'dest': `${config.paths.buildTarget}/main.js`
      }
    ],
  }
};