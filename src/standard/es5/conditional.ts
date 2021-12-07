import * as t from '@babel/types';

import { ScopeType } from '../../types';
import { Path } from '../../path';
import { Signal } from '../../signal';

export function IfStatement(path: Path<t.IfStatement>) {
  const ifScope = path.scope.createChild(ScopeType.If);
  ifScope.invasive = true;
  ifScope.isolated = false;
  if (path.visitor(path.createChild(path.node.test, ifScope))) {
    return path.visitor(path.createChild(path.node.consequent, ifScope));
  }
  if (path.node.alternate) {
    return path.visitor(path.createChild(path.node.alternate, ifScope));
  }
}

export function SwitchStatement(path: Path<t.SwitchStatement>) {
  const { node, scope } = path;
  const discriminant = path.visitor(path.createChild(node.discriminant)); // switch的条件
  const switchScope = scope.createChild(ScopeType.Switch);
  switchScope.invasive = true;
  switchScope.isolated = false;

  let matched = false;
  for (const $case of node.cases) {
    // 进行匹配相应的 case
    if (
      !matched &&
      (!$case.test || discriminant === path.visitor(path.createChild($case.test, switchScope)))
    ) {
      matched = true;
    }

    if (matched) {
      const result = path.visitor(path.createChild($case, switchScope));

      if (Signal.isBreak(result)) {
        break;
      } else if (Signal.isContinue(result)) {
        // SwitchStatement can not use continue keyword
        // but it can continue parent loop, like for, for-in, for-of, while
        return result;
      } else if (Signal.isReturn(result)) {
        return result;
      }
    }
  }
}

export function SwitchCase(path: Path<t.SwitchCase>) {
  const { node } = path;
  for (const stmt of node.consequent) {
    const result = path.visitor(path.createChild(stmt));
    if (result instanceof Signal) {
      return result;
    }
  }
}

export function ConditionalExpression(path: Path<t.ConditionalExpression>) {
  return path.visitor(path.createChild(path.node.test))
    ? path.visitor(path.createChild(path.node.consequent))
    : path.visitor(path.createChild(path.node.alternate));
}
