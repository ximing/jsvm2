import * as t from '@babel/types';
import { Path } from '../../path';
import { Signal } from '../../signal';

export function ReturnStatement(path: Path<t.ReturnStatement>) {
  return new Signal(
    'return',
    path.node.argument ? path.visitor(path.createChild(path.node.argument)) : undefined
  );
}

export function BreakStatement(path) {
  const label = path.node.label;
  return new Signal('break', label ? label.name : undefined);
}

export function ContinueStatement(path) {
  const label = path.node.label;
  return new Signal('continue', label ? label.name : undefined);
}
