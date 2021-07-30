import * as t from '@babel/types';
import { Path } from '../../path';

export function SpreadElement(path: Path<t.SpreadElement>) {
  return path.visitor(path.createChild(path.node.argument));
}
