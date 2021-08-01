import * as t from '@babel/types';
import { Path } from '../../path';
import { isArrayPattern, isIdentifier, isObjectPattern, isObjectProperty } from '../babelTypes';
import { Node } from '../../types';
import { overrideStack } from '../utils';
import { ErrInvalidIterable } from '../../error';
import { Scope } from '../../scope';
import { Kind } from '../../var';
import { TypeAnnotation } from '@babel/types';

export function VariableDeclaration(path: Path<t.VariableDeclaration>) {
  const { node, scope, stack } = path;
  const { kind, declarations } = node;
  declarations.forEach((declarator) => {
    const map: { [k: string]: any } = {};
    if (isIdentifier(declarator.id)) {
      /**
       * var a = 1
       * num = 1
       * var num;
       */
      if (declarator.init || kind !== Kind.var) {
        map[declarator.id.name] = declarator.init
          ? path.visitor(path.createChild(declarator.init))
          : undefined;
      }
    } else if (isObjectPattern(declarator.id)) {
      /*
       * @es2015
       * var {attr1,attr2} = obj;
       * */
      const vars: { key: string; alias: string }[] = [];
      for (const n of declarator.id.properties) {
        if (isObjectProperty(n)) {
          vars.push({
            key: (n.key as any).name as string,
            alias: (n.value as any).name as string,
          });
        }
      }
      const obj = path.visitor(path.createChild(declarator.init as Node));

      for (const $var of vars) {
        if ($var.key in obj) {
          map[$var.alias] = obj[$var.key];
        }
      }
    } else if (isArrayPattern(declarator.id)) {
      /*
       * @es2015
       * var [a] = arr;
       * */
      const initValue = path.visitor(path.createChild(declarator.init as Node));

      if (!initValue[Symbol.iterator]) {
        throw overrideStack(
          ErrInvalidIterable('{(intermediate value)}'),
          stack,
          declarator.init as Node
        );
      }

      declarator.id.elements.forEach((n, i) => {
        if (n && isIdentifier(n)) {
          // TODO 这里处理的还不太对
          const $varName: string = n.typeAnnotation
            ? ((n.typeAnnotation as TypeAnnotation).typeAnnotation as any).id.name
            : n.name;

          const el = initValue[i];
          map[$varName] = el;
        }
      });
    } else {
      throw node;
    }
    for (const varName in map) {
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
        targetScope.declareVar(varName, map[varName]);
      } else {
        scope.declare(kind, varName, map[varName]);
      }
    }
  });
}
// TODO 抽离到VariableDeclarator中
// export function VariableDeclarator(path: Path<t.VariableDeclarator>) {
//
// }
