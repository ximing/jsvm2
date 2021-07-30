import standardVisitors from './standard';
import { Path } from './path';
import { ErrImplement } from './error';

export function visitor(path: Path<any>) {
  path.visitor = visitor;
  if (!standardVisitors[path.node.type]) throw ErrImplement(path.node.type);
  return standardVisitors[path.node.type](path);
}
