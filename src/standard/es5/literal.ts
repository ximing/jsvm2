import * as t from '@babel/types';
import { Path } from '../../path';

export function RegExpLiteral(path: Path<t.RegExpLiteral>) {
  const { node } = path;
  return new RegExp(node.pattern, node.flags);
}
export function StringLiteral(path: Path<t.StringLiteral>) {
  return path.node.value;
}
export function NumericLiteral(path: Path<t.NumericLiteral>) {
  return path.node.value;
}
export function BooleanLiteral(path: Path<t.BooleanLiteral>) {
  return path.node.value;
}
export function NullLiteral() {
  return null;
}
