import { Path } from './path';
import { Scope } from './scope';
import { Stack } from './stack';
import { visitor } from './visitor';
import { Context, ISandBox } from './context';
import { MODULE, EXPORTS } from './constants';

/**
 * Run the code in context
 * @export
 * @param {string} code
 * @param {Context} context
 * @returns
 */
export function runInContext(ast: any, context = createContext()) {
  const s = Scope.createRoot(context);
  // define module
  const $exports = {};
  const $module = { exports: $exports };
  s.declareConst(MODULE, $module);
  s.declareVar(EXPORTS, $exports);
  const path = new Path(ast, null, s, {}, new Stack());
  const res = visitor(path);
  // exports
  const moduleVar = s.hasBinding(MODULE);
  return moduleVar ? moduleVar.value.exports : res;
}

export function run(ast: any, context?: Context) {
  const s = Scope.createRoot(context);
  const path = new Path(ast, null, s, {}, new Stack());
  const res = visitor(path);
  return res;
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

export default { runInContext, createContext, run };
