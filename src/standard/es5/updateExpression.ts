import * as t from '@babel/types';
import { Path } from '../../path';
import { isIdentifier, isMemberExpression } from '../babelTypes';
import { overrideStack } from '../utils';
import { ErrNotDefined } from '../../error';
import { Kind } from '../../var';
// ++argument or argument++ Increments or decrements a number.

// https://www.w3school.com.cn/js/pro_js_operators_unary.asp
// https://doc.esdoc.org/github.com/mason-lang/esast/class/src/ast.js~UpdateExpression.html
export function UpdateExpression(path: Path<t.UnaryExpression>) {
  const { node, scope, stack } = path;
  const { prefix, argument } = node;
  let $var: any;
  if (isIdentifier(argument)) {
    const { name } = argument;
    const $$var = scope.hasBinding(name);
    if (!$$var) {
      throw overrideStack(ErrNotDefined(name), stack, argument);
    }
    $var = $$var;
  } else if (isMemberExpression(argument)) {
    const object = path.visitor(path.createChild(argument.object));
    const property = argument.computed
      ? path.visitor(path.createChild(argument.property))
      : (argument.property as t.Identifier).name;
    $var = {
      kind: Kind.const,
      set value(value: any) {
        object[property] = value;
      },
      get value() {
        return object[property];
      },
    };
  }

  return {
    '--': (v) => {
      $var.value = v - 1;
      return prefix ? --v : v--;
    },
    '++': (v) => {
      $var.value = v + 1;
      return prefix ? ++v : v++;
    },
  }[node.operator](path.visitor(path.createChild(node.argument)));
}
