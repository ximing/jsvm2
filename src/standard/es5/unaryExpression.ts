import * as t from '@babel/types';
import { Path } from '../../path';
import { THIS, UNDEFINED } from '../../constants';
import { isIdentifier, isMemberExpression } from '../babelTypes';

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#delete
// https://www.w3school.com.cn/js/pro_js_operators_unary.asp
export function UnaryExpression(path: Path<t.UnaryExpression>) {
  const { node, scope } = path;
  return {
    delete: () => {
      if (isMemberExpression(node.argument)) {
        const { object, property, computed } = node.argument;
        if (computed) {
          return delete path.visitor(path.createChild(object))[
            path.visitor(path.createChild(property))
          ];
        } else {
          return delete path.visitor(path.createChild(object))[(property as t.Identifier).name];
        }
      } else if (isIdentifier(node.argument)) {
        const $this = scope.hasBinding(THIS);
        if ($this) {
          return $this.value[node.argument.name];
        } else {
          console.error('jsvm illegal this');
        }
      } else {
        console.error('jsvm illegal delete');
      }
    },
    typeof: (): string => {
      if (isIdentifier(node.argument)) {
        const $var = scope.hasBinding(node.argument.name);
        return $var ? typeof $var.value : UNDEFINED;
      } else {
        return typeof path.visitor(path.createChild(node.argument));
      }
    },
    void: () => void path.visitor(path.createChild(node.argument)),
    '+': () => +path.visitor(path.createChild(node.argument)),
    '-': () => -path.visitor(path.createChild(node.argument)),
    '!': () => !path.visitor(path.createChild(node.argument)),
    '~': () => ~path.visitor(path.createChild(node.argument)),
  }[node.operator]();
}
