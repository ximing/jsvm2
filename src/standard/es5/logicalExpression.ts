import * as t from '@babel/types';

import { Path } from '../../path';

export function LogicalExpression(path: Path<t.LogicalExpression>) {
  const { node } = path;
  return {
    '||': () =>
      path.visitor(path.createChild(node.left)) || path.visitor(path.createChild(node.right)),
    '&&': () =>
      path.visitor(path.createChild(node.left)) && path.visitor(path.createChild(node.right)),
  }[node.operator]();
}
