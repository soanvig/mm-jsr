import typescript from '@rollup/plugin-typescript';
import ttypescript from 'ttypescript';
import { terser } from 'rollup-plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies || {});

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
    nodeResolve(),
    commonjs(),
  ],
  external,
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