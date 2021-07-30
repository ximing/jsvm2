import * as t from '@babel/types';
import { Path } from '../../path';

export function SequenceExpression(path: Path<t.SequenceExpression>) {
  return path.visitor(path.createChild(path.node.expressions.slice(-1)[0]));
}
