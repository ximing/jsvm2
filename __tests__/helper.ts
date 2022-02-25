import { parse, parseExpression } from '@babel/parser';
import { createContext, runInContext, run as VMRun } from '../src/vm';

export const run = function (code, ctx = {}) {
  const sandbox: any = createContext(ctx);
  const ast = parse(code, {
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

  return runInContext(ast, sandbox);
};

export const runExp = function (code: string, ctx = {}) {
  const sandbox: any = createContext(ctx);
  return VMRun(parseExpression(code), sandbox);
};
