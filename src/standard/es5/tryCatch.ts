import * as t from '@babel/types';
import { ScopeType } from '../../types';
import { Path } from '../../path';
import { Signal } from '../../signal';

export function ThrowStatement(path: Path<t.ThrowStatement>) {
  // TODO: rewrite the stack log
  throw path.visitor(path.createChild(path.node.argument));
}

export function CatchClause(path: Path<t.CatchClause>) {
  return path.visitor(path.createChild(path.node.body));
}

export function TryStatement(path: Path<t.TryStatement>) {
  const { node, scope } = path;
  try {
    const tryScope = scope.createChild(ScopeType.Block);
    // tryScope.invasive = true;
    // tryScope.isolated = false;
    return path.visitor(path.createChild(node.block, tryScope));
  } catch (err) {
    if (node.handler) {
      const param = node.handler!.param as t.Identifier;
      const catchScope = scope.createChild(ScopeType.Block);
      // catchScope.invasive = true;
      // catchScope.isolated = false;
      catchScope.declareConst(param.name, err);
      return path.visitor(path.createChild(node.handler!, catchScope));
    } else {
      throw err;
    }
  } finally {
    if (node.finalizer) {
      const finallyScope = scope.createChild(ScopeType.Block);
      // finallyScope.invasive = true;
      // finallyScope.isolated = false;
      const single = path.visitor(path.createChild(node.finalizer, finallyScope));
      // return single;
      if (Signal.isReturn(single)) {
        return single;
      }
    }
  }
}
