import { parse, parseExpression } from '@babel/parser';
import { createContext, runInContext, run as VMRun } from '../src/vm';

const babel = require('@babel/core');

export const run = function (code, ctx = {}, hoisting = true, convertES5 = false) {
  let transformCode = code;
  if (convertES5) {
    const result = babel.transformSync(code, {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              browsers: ['safari >= 9', 'android >= 4.4'],
            },
            useBuiltIns: false,
          },
        ],
      ],
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
      configFile: false,
      babelrc: false,
    });
    transformCode = result.code;
  }
  if (hoisting) {
    const result = babel.transformSync(transformCode, {
      plugins: [require('../plugin/hoisting')],
      configFile: false,
      babelrc: false,
    });
    transformCode = result.code;
  }
  const ast = parse(transformCode, {
    sourceType: 'module',
    plugins: [],
  });
  const sandbox: any = createContext(ctx);
  return runInContext(ast, sandbox);
};

export const runExp = function (code: string, ctx = {}) {
  const sandbox: any = createContext(ctx);
  return VMRun(parseExpression(code), sandbox);
};
