import * as t from '@babel/types';
import { Path } from '../../path';
import { isSpreadElement } from '../babelTypes';

// var arr = [1,{},null,undefined,false,...b];
export function ArrayExpression(path: Path<t.ArrayExpression>) {
  return path.node.elements.reduce((pre: any[], cur) => {
    // https://github.com/babel/babel/issues/10948
    // [,] will be parsed as elements: [null] while [null] will be parsed as elements: [NullLiteral].
    if (cur === null) {
      pre.length += 1;
      return pre;
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
