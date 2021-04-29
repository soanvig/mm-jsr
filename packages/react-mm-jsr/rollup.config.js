import typescript from '@rollup/plugin-typescript';
import ttypescript from 'ttypescript';
import { terser } from 'rollup-plugin-terser';

const outputCommons = {
  format: 'umd',
  name: 'ReactJSR',
};

export default {
  input: 'src/index.ts',
  plugins: [
    typescript({
      typescript: ttypescript,
      declaration: true,
      declarationDir: './build/types',
      rootDir: 'src/',
    }),
  ],
  output: [
    {
      ...outputCommons,
      dir: './build',
      sourcemap: true,
      plugins: [
        terser(),
      ],
    },
  ],
};