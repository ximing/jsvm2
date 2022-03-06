import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'index.js',
  output: [
    {
      file: 'lodash.out.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
    },
  ],
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
    commonjs(),
    babel({
      assumptions: {
        noDocumentAll: true,
        noClassCalls: true,
        enumerableModuleMeta: true,
        constantReexports: true,
        iterableIsArray: true,
        noNewArrows: true,
        objectRestNoSymbols: true,
        privateFieldsAsProperties: true,
        setClassMethods: true,
        setComputedProperties: true,
        setPublicClassFields: true,
        setSpreadProperties: true,
        superIsCallableConstructor: true,
        skipForOfIteratorClosing: true,
      },
      presets: [
        [
          '@babel/env',
          {
            targets: {
              browsers: ['safari >= 9', 'android >= 4.4'],
            },
          },
        ],
      ],
      plugins: [],
      extensions: ['.js'],
    }),
  ],
};
