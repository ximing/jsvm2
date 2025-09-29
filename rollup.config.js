import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package.json' with { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    typescript({
      tsconfig: 'tsconfig.build.json',
      declarationDir: 'lib',
    }),
    commonjs(),
  ],
};
