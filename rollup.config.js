import typescript from '@rollup/plugin-typescript';
import ttypescript from 'ttypescript';
import { terser } from 'rollup-plugin-terser';

const outputCommons = {
  format: 'umd',
  name: 'JSR',
};

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      typescript: ttypescript,
    }),
  ],
  output: [
    {
      ...outputCommons,
      sourcemap: true,
      file: 'build/jsr.js',
    },
    {
      ...outputCommons,
      file: 'build/jsr.min.js',
      plugins: [
        terser(),
      ],
    },
  ],
};