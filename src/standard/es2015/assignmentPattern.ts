import * as t from '@babel/types';
import { Path } from '../../path';
import { isIdentifier } from '../babelTypes';
import { ErrImplement } from '../../error';
import { overrideStack } from '../utils';

export function AssignmentPattern(path: Path<t.AssignmentPattern>) {
  const { node, scope, ctx, stack } = path;
  const { value } = ctx;
  if (isIdentifier(node.left)) {
    scope.declareConst(
      node.left.name,
      value === undefined ? path.visitor(path.createChild(node.right)) : value
    );
  } else {
    throw overrideStack(ErrImplement(`AssignmentPattern.${node.type}`), stack, node);
  }
}
