import * as t from '@babel/types';
import { Path } from '../../path';
import { Scope } from '../../scope';
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
  return path.visitor(path.createChild(path.node.body, path.scope, { labelName: label.name }));
}

export function EmptyStatement() {}

// A block statement, i.e., a sequence of statements surrounded by braces.
export function BlockStatement(path: Path<t.BlockStatement>) {
  const { node: block, scope } = path;

  let blockScope: Scope = !scope.isolated ? scope : scope.createChild(ScopeType.Block);

  if (scope.isolated) {
    blockScope = scope.createChild(ScopeType.Block);
    blockScope.invasive = true;
  } else {
    blockScope = scope;
  }

  blockScope.isolated = true;

  // hoisting
  for (const node of block.body) {
    if (isFunctionDeclaration(node)) {
      path.visitor(path.createChild(node));
    } else if (isVariableDeclaration(node)) {
      for (const declaration of node.declarations) {
        if (node.kind === Kind.var) {
          if (!scope.isolated && scope.invasive) {
            const targetScope = (function get(s: Scope): Scope {
              if (s.parent) {
                if (s.parent.invasive) {
                  return get(s.parent);
                } else {
                  return s.parent;
                }
              } else {
                return s;
              }
            })(scope);
            targetScope.declareVar((declaration.id as t.Identifier).name, undefined);
          } else {
            scope.declareVar((declaration.id as t.Identifier).name, undefined);
          }
        }
      }
    }
  }

  let tempResult;
  for (const node of block.body) {
    const result = (tempResult = path.visitor(path.createChild(node, blockScope)));
    if (result instanceof Signal) {
      return result;
    }
  }
  // to support do-expression
  // anyway, return the last item
  return tempResult;
}
