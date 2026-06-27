import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    file: 'public/build/bundle.js',
    format: 'iife',
  },
  plugins: [
    resolve({
      browser: true,
    }),
    terser({}),
  ],
};
