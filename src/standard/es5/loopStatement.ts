import * as t from '@babel/types';

import { Path } from '../../path';
import { ScopeType } from '../../types';
import { Signal } from '../../signal';
import { isIdentifier } from '../babelTypes';

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Loops_and_iteration
export function ForStatement(path: Path<t.ForStatement>) {
  const { node, scope, ctx } = path;
  const labelName = ctx.labelName as string | void;
  const forScope = scope.createChild(ScopeType.Block);

  // forScope.invasive = true; // 有块级作用域
  const { init, update, test, body } = node;
  for (
    init && path.visitor(path.createChild(init, forScope));
    !test || (test && path.visitor(path.createChild(test, forScope)));
    update && path.visitor(path.createChild(update, forScope))
  ) {
    const loopScope = forScope.fork(ScopeType.Block);
    const signal = path.visitor(
      path.createChild(body, loopScope, {
        labelName: undefined,
      })
    );
    if (Signal.isBreak(signal)) {
      if (!signal.value) {
        break;
      }
      if (signal.value === labelName) {
        break;
      }
      return signal;
    } else if (Signal.isContinue(signal)) {
      if (!signal.value) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // 处理同级别的
      if (signal.value === labelName) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // 处理label 为父层级的
      return signal;
    } else if (Signal.isReturn(signal)) {
      return signal;
    }
  }
}

export function DoWhileStatement(path: Path<t.DoWhileStatement>) {
  const { node, scope, ctx } = path;
  const labelName: string | void = ctx.labelName;
  // do while don't have his own scope
  do {
    const doWhileScope = scope.createChild(ScopeType.Block);
    // doWhileScope.invasive = true;
    // doWhileScope.isolated = false;
    const signal = path.visitor(
      path.createChild(node.body, doWhileScope, {
        labelName: undefined,
      })
    );
    if (Signal.isBreak(signal)) {
      if (!signal.value) {
        break;
      }
      if (signal.value === labelName) {
        break;
      }
      return signal;
    } else if (Signal.isContinue(signal)) {
      if (!signal.value) {
        continue;
      }
      if (signal.value === labelName) {
        continue;
      }
      return signal;
    } else if (Signal.isReturn(signal)) {
      return signal;
    }
  } while (path.visitor(path.createChild(node.test)));
}

export function WhileStatement(path: Path<t.WhileStatement>) {
  const { node, scope, ctx } = path;
  const labelName: string | void = ctx.labelName;

  while (path.visitor(path.createChild(node.test))) {
    const whileScope = scope.createChild(ScopeType.Block);
    // whileScope.invasive = true;
    // whileScope.isolated = false;
    const signal = path.visitor(
      path.createChild(node.body, whileScope, {
        labelName: undefined,
      })
    );
    if (Signal.isBreak(signal)) {
      if (!signal.value) {
        break;
      }

      if (signal.value === labelName) {
        break;
      }

      return signal;
    } else if (Signal.isContinue(signal)) {
      if (!signal.value) {
        continue;
      }

      if (signal.value === labelName) {
        continue;
      }
      return signal;
    } else if (Signal.isReturn(signal)) {
      return signal;
    }
  }
}

// for (w in g){} 也是被允许的  react构建出的dist大量应用
export function ForInStatement(path: Path<t.ForInStatement>) {
  const { node, scope, ctx } = path;

  let kind;
  let name;
  if (isIdentifier(node.left)) {
    kind = 'var';
    name = node.left.name;
  } else {
    kind = (node.left as t.VariableDeclaration).kind;
    let decl = (node.left as t.VariableDeclaration).declarations[0];
    name = (decl.id as t.Identifier).name;
  }

  const labelName: string = ctx.labelName;

  const right = path.visitor(path.createChild(node.right));
  for (const value in right) {
    const forInScope = scope.createChild(ScopeType.Block);
    // forInScope.invasive = true;
    // forInScope.isolated = false;
    forInScope.declare(kind, name, value);

    const signal = path.visitor(
      path.createChild(node.body, forInScope, {
        labelName: undefined,
      })
    );

    if (Signal.isBreak(signal)) {
      if (!signal.value) {
        break;
      }
      if (signal.value === labelName) {
        break;
      }
      return signal;
    } else if (Signal.isContinue(signal)) {
      if (!signal.value) {
        continue;
      }
      if (signal.value === labelName) {
        continue;
      }
      return signal;
    } else if (Signal.isReturn(signal)) {
      return signal;
    }
  }
}
