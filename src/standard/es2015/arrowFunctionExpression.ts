import * as t from '@babel/types';
import { THIS } from '../../constants';
import { Path } from '../../path';
import { Signal } from '../../signal';
import { ScopeType } from '../../types';
import { defineFunction } from '../utils';

export function ArrowFunctionExpression(path: Path<t.ArrowFunctionExpression>) {
  const { node, scope } = path;
  const func = (...args) => {
    const newScope = scope.createChild(ScopeType.Function);
    for (let i = 0; i < node.params.length; i++) {
      const { name } = node.params[i] as t.Identifier;
      newScope.declareConst(name, args[i]);
    }
    const lastThis = scope.hasBinding(THIS);
    newScope.declareConst(THIS, lastThis ? lastThis.value : null);
    const result = path.visitor(path.createChild(node.body, newScope));
    if (Signal.isReturn(result)) {
      return result.value;
    } else {
      return result;
    }
  };
  defineFunction(func, node);
  return func;
}
