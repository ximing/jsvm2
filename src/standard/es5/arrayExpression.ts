import * as t from '@babel/types';
import { Path } from '../../path';
import { isSpreadElement } from '../babelTypes';

// var arr = [1,{},null,undefined,false,...b];
export function ArrayExpression(path: Path<t.ArrayExpression>) {
  return path.node.elements.reduce((pre: any[], cur) => {
    if (cur === null) {
      pre.push(undefined);
    } else if (isSpreadElement(cur)) {
      const arr = path.visitor(path.createChild(cur));
      // TODO 这么做会有问题，比如[...string] 不是预期结果
      return pre.concat(arr);
    } else {
      pre.push(path.visitor(path.createChild(cur)));
    }
    return pre;
  }, []);
}
