const uglify = require('rollup-plugin-uglify');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const eslint = require('rollup-plugin-eslint');
const alias = require('rollup-plugin-alias');
const uglifyES = require('uglify-es');

const path = require('path');

module.exports = {
  options: {
    format: 'umd',
    moduleName: 'JSR'
  },
  dev: {
    files: [
      {
        'src': `${config.paths.source}/index.js`,
        'dest': `${config.paths.temp}/main.js`
      }
    ],
    options: {
      plugins: () => {
        return [
          eslint({
            throwOnError: true
          }),
          alias({
            '@': path.join(process.cwd(), './src'),
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
          alias({
            '@': path.join(process.cwd(), './src'),
          }),
          resolve({
            jsnext: true,
            main: true,
            browser: true
          }),
          commonjs(),
          babel({
            exclude: './node_modules/**',
            babelrc: false,
            presets: ['es2015-rollup']
          }),
          uglify({}, uglifyES.minify)
        ];
      },
      sourceMap: false
    },

    files: [
      {
        'src': `${config.paths.source}/index.js`,
        'dest': `${config.paths.buildTarget}/main.js`
      }
    ],
  }
};