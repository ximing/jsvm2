import * as t from '@babel/types';
import { Path } from '../../path';

export function RestElement(path: Path<t.RestElement>) {
  const { node, scope, ctx } = path;
  const { value } = ctx;
  scope.declareConst((node.argument as t.Identifier).name, value);
}
