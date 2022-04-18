// rollup.config.js
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: __dirname + '/src/main.js',
  output: {
    file: __dirname + '/public/build/bundle.js',
    format: 'iife',
    plugins: [
      terser(),
    ],
  },
  plugins: [
    svelte({
      emitCss: false,
    }),
    // see NOTICE below
    resolve({ browser: true }),
    commonjs()
    // ...
  ],
};