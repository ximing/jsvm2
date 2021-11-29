import * as t from '@babel/types';
import { Path } from '../../path';

export function SequenceExpression(path: Path<t.SequenceExpression>) {
  let result;
  path.node.expressions.forEach((expression) => {
    result = path.visitor(path.createChild(expression));
  });
  return result;
}
