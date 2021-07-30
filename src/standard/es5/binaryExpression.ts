import * as t from '@babel/types';
import { Path } from '../../path';

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#%E7%AE%97%E6%9C%AF%E8%BF%90%E7%AE%97%E7%AC%A6
export const BinaryExpressionOperatorMap = {
  '<<': (a, b) => a << b,
  '>>': (a, b) => a >> b,
  '>>>': (a, b) => a >>> b,

  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  in: (a, b) => a in b,
  instanceof: (a, b) => a instanceof b,

  '==': (a, b) => a == b,
  '!=': (a, b) => a != b,
  '===': (a, b) => a === b,
  '!==': (a, b) => a !== b,

  '&': (a, b) => a & b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
  '%': (a, b) => a % b,
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '^': (a, b) => a ^ b,
  '|': (a, b) => a | b,
};

// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Expressions_and_Operators#%E7%AE%97%E6%9C%AF%E8%BF%90%E7%AE%97%E7%AC%A6
export function BinaryExpression(path: Path<t.BinaryExpression>) {
  const { node } = path;
  return BinaryExpressionOperatorMap[node.operator](
    path.visitor(path.createChild(node.left)),
    path.visitor(path.createChild(node.right))
  );
}
