import * as t from '@babel/types';
import { newFunction, overrideStack } from '../utils';
import { Path } from '../../path';

export function NewExpression(path: Path<t.NewExpression>) {
  const { node, stack } = path;
  const func = path.visitor(path.createChild(node.callee));
  const args: any[] = node.arguments.map((arg) => path.visitor(path.createChild(arg)));
  func.prototype.constructor = func;
  newFunction.set(func, true);
  let entity = new func(...args);
  newFunction.delete(func);
  // stack track for Error constructor
  if (func === Error || entity instanceof Error) {
    entity = overrideStack(entity, stack, node);
  }
  return entity;
}
