import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      format: 'es',
      file: './build/index.js',
      sourcemap: true,
      name: 'ReactJSR',
      globals: {
        react: 'React',
        'mm-jsr': 'JSR',
      },
    },
  ],
  external: ['react', 'mm-jsr'],
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
