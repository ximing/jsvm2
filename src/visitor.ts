import standardVisitors from './standard';
import { Path } from './path';
import { ErrImplement } from './error';
import { overrideStack } from './standard/utils';

export function visitor(path: Path<any>) {
  path.visitor = visitor;
  if (!standardVisitors[path.node.type])
    throw overrideStack(ErrImplement(path.node.type), path.stack, path.node);
  return standardVisitors[path.node.type](path);
}
