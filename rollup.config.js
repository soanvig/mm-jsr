import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import * as path from 'path';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'build',
    format: 'umd',
  },
  plugins: [
    typescript(),
    alias({
      '@': path.join(process.cwd(), './src'),
    }),
  ],
};