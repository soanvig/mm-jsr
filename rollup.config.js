import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'umd',
  },
  plugins: [
    typescript(),
  ],
};