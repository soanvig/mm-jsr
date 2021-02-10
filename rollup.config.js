import typescript from '@rollup/plugin-typescript';
import ttypescript from 'ttypescript';
import * as path from 'path';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'umd',
  },
  plugins: [
    typescript({
      typescript: ttypescript,
    }),
  ],
};