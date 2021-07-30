import * as t from '@babel/types';

import { Path } from '../../path';
import { ScopeType } from '../../types';
import { Signal } from '../../signal';

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Loops_and_iteration
export function ForStatement(path: Path<t.ForStatement>) {
  const { node, scope, ctx } = path;
  const labelName = ctx.labelName as string | void;
  const forScope = scope.createChild(ScopeType.For);

  forScope.invasive = true; // 有块级作用域

  // init loop
  if (node.init) {
    path.visitor(path.createChild(node.init, forScope));
  }

  function update(): void {
    if (node.update) {
      path.visitor(path.createChild(node.update, forScope));
    }
  }

  function test(): boolean {
    return node.test ? path.visitor(path.createChild(node.test, forScope)) : true;
  }

  while (true) {
    // every loop will create it's own scope
    // it should inherit from forScope
    const loopScope = forScope.fork(ScopeType.ForChild);
    loopScope.isolated = false;
    if (!test()) {
      break;
    }

    const signal = path.visitor(path.createChild(node.body, loopScope, { labelName: undefined }));

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
        update();
        continue;
      }
      if (signal.value === labelName) {
        update();
        continue;
      }
      return signal;
    } else if (Signal.isReturn(signal)) {
      return signal;
    }

    update();
  }
}

export function DoWhileStatement(path: Path<t.DoWhileStatement>) {
  const { node, scope, ctx } = path;
  const labelName: string | void = ctx.labelName;
  // do while don't have his own scope
  do {
    const doWhileScope = scope.createChild(ScopeType.DoWhile);
    doWhileScope.invasive = true;
    doWhileScope.isolated = false;
    const signal = path.visitor(path.createChild(node.body, doWhileScope));
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
    const whileScope = scope.createChild(ScopeType.While);
    whileScope.invasive = true;
    whileScope.isolated = false;
    const signal = path.visitor(path.createChild(node.body, whileScope));
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

export function ForInStatement(path: Path<t.ForInStatement>) {
  const { node, scope, ctx } = path;
  const kind = (node.left as t.VariableDeclaration).kind;
  const decl = (node.left as t.VariableDeclaration).declarations[0];
  const name = (decl.id as t.Identifier).name;

  const labelName: string = ctx.labelName;

  const right = path.visitor(path.createChild(node.right));

  for (const value in right) {
    if (Object.hasOwnProperty.call(right, value)) {
      const forInScope = scope.createChild(ScopeType.ForIn);
      forInScope.invasive = true;
      forInScope.isolated = false;
      forInScope.declare(kind, name, value);

      const signal = path.visitor(path.createChild(node.body, forInScope));

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
}
