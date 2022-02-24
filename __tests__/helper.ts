import { parse } from '@babel/parser';
import { createContext, runInContext } from '../src/vm';

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
