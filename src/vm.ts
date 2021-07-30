import { parse } from '@babel/parser';

import { Path } from './path';
import { Scope } from './scope';
import { Stack } from './stack';
import { visitor } from './visitor';
import { Context, ISandBox } from './context';
import { MODULE, EXPORTS, THIS } from './constants';
import { ScopeType, presetMap } from './types';

/**
 * Run the code in context
 * @export
 * @param {string} code
 * @param {Context} context
 * @returns
 */
export function runInContext(code: string, context?: Context, preset: presetMap = presetMap.env) {
  const scope = new Scope(ScopeType.Root, null);
  scope.level = 0;
  scope.invasive = true;
  scope.declareConst(THIS, undefined);
  scope.setContext(context);

  // define module
  const $exports = {};
  const $module = { exports: $exports };
  scope.declareConst(MODULE, $module);
  scope.declareVar(EXPORTS, $exports);

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

  const path = new Path(ast, null, scope, {}, new Stack());
  path.preset = preset;
  path.visitor = visitor;
  visitor(path);
  // exports
  const moduleVar = scope.hasBinding(MODULE);
  return moduleVar ? moduleVar.value.exports : undefined;
}

/**
 * Create a context
 * @export
 * @param {ISandBox} [sandbox={}]
 * @returns {Context}
 */
export function createContext(sandbox: ISandBox = {}): Context {
  return new Context(sandbox);
}

export default { runInContext, createContext };
