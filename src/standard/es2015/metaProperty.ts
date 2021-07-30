import * as t from '@babel/types';
import { Path } from '../../path';

export function MetaProperty(path: Path<t.MetaProperty>) {
  const obj = path.visitor(path.createChild(path.node.meta));
  return obj[path.node.property.name];
}
