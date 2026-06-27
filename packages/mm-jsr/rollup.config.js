import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'es',
      file: './build/index.js',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      declaration: true,
      rootDir: 'src/',
    }),
    terser({
      keep_classnames: true,
    }),
  ],
};
