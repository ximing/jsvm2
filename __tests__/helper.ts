import { parse, parseExpression } from '@babel/parser';
import { createContext, runInContext, run as VMRun } from '../src/vm';

const babel = require('@babel/core');

function minifySync(code: string) {
  const child_process = require('child_process');
  let out = '';
  try {
    out = child_process.execSync('node __tests__/minifysync.js', {
      input: code,
      encoding: 'utf-8',
      //timeout: Infinity,
      maxBuffer: Infinity,
      windowsHide: true, // windows os
    });
  } catch (error) {
    // timeout, exit(1), exit(2)
    console.log('error in minify:\n' + error.stdout);
    throw new Error('minify failed');
  }
  return out;
}

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
  try {
    if (process.env.TERSER === 'true') {
      transformCode = minifySync(transformCode);
    }
    const ast = parse(transformCode, {
      sourceType: 'module',
      plugins: [],
    });
    const sandbox: any = createContext(ctx);
    return runInContext(ast, sandbox);
  } catch (err) {
    console.log(transformCode);
    throw err;
  }
};

export const runExp = function (code: string, ctx = {}) {
  const sandbox: any = createContext(ctx);
  return VMRun(parseExpression(code), sandbox);
};
