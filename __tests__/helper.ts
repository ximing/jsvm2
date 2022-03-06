import { parse, parseExpression } from '@babel/parser';
import { createContext, runInContext, run as VMRun } from '../src/vm';

const babel = require('@babel/core');

export const run = function (code, ctx = {}) {
  const result = babel.transformSync(code, {
    plugins: [require('../plugin/hoisting')],
    configFile: false,
    babelrc: false,
  });
  const ast = parse(result.code, {
    sourceType: 'module',
    plugins: [
      'asyncGenerators',
      'classProperties',
      'decorators-legacy',
      'doExpressions',
      'exportDefaultFrom',
      'flow',
      'objectRestSpread',
    ],
  });
  const sandbox: any = createContext(ctx);
  return runInContext(ast, sandbox);
};

export const runExp = function (code: string, ctx = {}) {
  const sandbox: any = createContext(ctx);
  return VMRun(parseExpression(code), sandbox);
};
