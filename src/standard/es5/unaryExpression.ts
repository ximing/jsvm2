import * as t from '@babel/types';
import { Path } from '../../path';
import { THIS, UNDEFINED } from '../../constants';
import { isIdentifier, isLiteral, isMemberExpression, isNullLiteral } from '../babelTypes';

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
          // 非严格模式
          return $this.value[node.argument.name];
        } else {
          console.error('jsvm illegal this');
        }
      } else if (isLiteral(node.argument)) {
        if (isNullLiteral(node.argument)) {
          // @ts-ignore
          return delete null;
        }
        // @ts-ignore
        return delete node.argument.value;
      } else {
        // @ts-ignore
        return delete path.visitor(path.createChild(node.argument));
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
