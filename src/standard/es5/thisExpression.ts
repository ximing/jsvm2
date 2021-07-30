import * as t from '@babel/types';
import { Path } from '../../path';
import { THIS } from '../../constants';

export function ThisExpression(path: Path<t.ThisExpression>) {
  const { scope } = path;
  const tv = scope.hasBinding(THIS);
  return tv ? tv.value : null;
}
