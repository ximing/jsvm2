import * as t from '@babel/types';
import { Path } from '../../path';
import { Signal } from '../../signal';
import { ScopeType } from '../../types';
import { Kind } from '../../var';
import { isFunctionDeclaration, isVariableDeclaration } from '../babelTypes';

export function ExpressionStatement(path) {
  return path.visitor(path.createChild(path.node.expression));
}

export function DebuggerStatement() {
  debugger;
}

export function LabeledStatement(path: Path<t.LabeledStatement>) {
  const label = path.node.label as t.Identifier;
  const res = path.visitor(path.createChild(path.node.body, path.scope, { labelName: label.name }));
  if (res && Signal.isBreak(res) && res.value === label.name) {
    return undefined;
  }
  return res;
}

export function EmptyStatement() {}

// A block statement, i.e., a sequence of statements surrounded by braces.
export function BlockStatement(path: Path<t.BlockStatement>) {
  const { node: block, scope, parent } = path;
  // let blockScope: Scope = !scope.isolated ? scope : scope.createChild(ScopeType.Block);
  /*
   * function b(){
   *   let a = 0;
   *   {
   *       let a = 0
   *   }
   * }
   * 处理上面这种情况的，如果根是 function scope的话，没必要多新建一个 block作用域，但是里面的二级作用域需要创建
   * */
  const blockScope =
    scope.type !== ScopeType.Block && parent?.scope !== scope
      ? scope
      : scope.createChild(ScopeType.Block);
  // if (scope.isolated) {
  //   blockScope = scope.createChild(ScopeType.Block);
  //   // blockScope.invasive = true;
  // } else {
  //   blockScope = scope;
  // }

  // blockScope.isolated = true;

  // hoisting
  for (const node of block.body) {
    if (isFunctionDeclaration(node)) {
      path.visitor(path.createChild(node));
    } else if (isVariableDeclaration(node)) {
      for (const declaration of node.declarations) {
        if (node.kind === Kind.var) {
          scope.declareVar((declaration.id as t.Identifier).name, undefined);
        }
      }
    }
  }

  let result;
  for (const node of block.body) {
    if (!isFunctionDeclaration(node)) {
      result = path.visitor(path.createChild(node, blockScope));
      if (result instanceof Signal) {
        return result;
      }
    }
  }
  // to support do-expression
  // anyway, return the last item
  if (scope.type !== ScopeType.Function) {
    return result;
  }
}
