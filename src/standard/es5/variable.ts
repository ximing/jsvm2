import * as t from '@babel/types';
import { Path } from '../../path';
import {
  isArrayPattern,
  isIdentifier,
  isObjectExpression,
  isObjectPattern,
  isObjectProperty,
} from '../babelTypes';
import { Node, ScopeType } from '../../types';
import { overrideStack } from '../utils';
import { ErrInvalidIterable } from '../../error';
import { Scope } from '../../scope';
import { Kind } from '../../var';
import { TypeAnnotation } from '@babel/types';

export function VariableDeclaration(path: Path<t.VariableDeclaration>) {
  const { node, scope, stack } = path;
  const { kind, declarations } = node;
  declarations.forEach((declaration) => {
    const varKeyValueMap: { [k: string]: any } = {};
    if (isIdentifier(declaration.id)) {
      /**
       * var a = 1
       * num = 1
       * var num;
       */
      if (declaration.init || kind !== Kind.var) {
        varKeyValueMap[declaration.id.name] = declaration.init
          ? path.visitor(path.createChild(declaration.init))
          : undefined;
      }
    } else if (isObjectPattern(declaration.id)) {
      const vars: { key: string; alias: string }[] = [];
      for (const n of declaration.id.properties) {
        if (isObjectProperty(n)) {
          vars.push({
            key: (n.key as any).name as string,
            alias: (n.value as any).name as string,
          });
        }
      }
      const obj = path.visitor(path.createChild(declaration.init as Node));

      for (const $var of vars) {
        if ($var.key in obj) {
          varKeyValueMap[$var.alias] = obj[$var.key];
        }
      }
    } else if (isArrayPattern(declaration.id)) {
      // @es2015 destrucuring
      const initValue = path.visitor(path.createChild(declaration.init as Node));

      if (!initValue[Symbol.iterator]) {
        throw overrideStack(
          ErrInvalidIterable('{(intermediate value)}'),
          stack,
          declaration.init as Node
        );
      }

      declaration.id.elements.forEach((n, i) => {
        if (n && isIdentifier(n)) {
          // TODO 这里处理的还不太对
          const $varName: string = n.typeAnnotation
            ? ((n.typeAnnotation as TypeAnnotation).typeAnnotation as any).id.name
            : n.name;

          const el = initValue[i];
          varKeyValueMap[$varName] = el;
        }
      });
    } else {
      throw node;
    }
    for (const varName in varKeyValueMap) {
      /**
       * If the scope is penetrating and defined as VAR, it is defined on its parent scope
       * example:
       *
       * {
       *   var a = 123
       * }
       */
      if (scope.invasive && kind === Kind.var) {
        const targetScope: Scope = (function get(s: Scope) {
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
        targetScope.declareVar(varName, varKeyValueMap[varName]);
      } else {
        scope.declare(kind, varName, varKeyValueMap[varName]);
      }
    }
  });
}

export function VariableDeclarator(path: Path<t.VariableDeclarator>) {
  const { node, scope } = path;
  // @es2015 destructuring
  if (isObjectPattern(node.id)) {
    const newScope = scope.createChild(ScopeType.Object);
    if (isObjectExpression(node.init as Node)) {
      path.visitor(path.createChild(node.init as Node, newScope));
    }
    for (const n of node.id.properties) {
      if (isObjectProperty(n)) {
        const propertyName: string = (n as any).id.name;
        const $var = newScope.hasBinding(propertyName);
        const varValue = $var ? $var.value : undefined;
        scope.declareVar(propertyName, varValue);
        return varValue;
      }
    }
  } else if (isObjectExpression(node.init as Node)) {
    const varName: string = (node.id as t.Identifier).name;
    const varValue = path.visitor(path.createChild(node.init as Node));
    scope.declareVar(varName, varValue);
    return varValue;
  } else {
    throw node;
  }
}
