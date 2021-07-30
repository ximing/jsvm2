import * as t from '@babel/types';
import { Path } from '../../path';
import { isIdentifier, isMemberExpression, isStringLiteral } from '../babelTypes';
import { isFunction, overrideStack } from '../utils';
import { ErrIsNotFunction } from '../../error';
import { ANONYMOUS, THIS } from '../../constants';

// console.log("123")
// console['log']("123")
// log("12")
export function CallExpression(path: Path<t.CallExpression>) {
  const { node, scope, stack } = path;
  const functionName: string = isMemberExpression(node.callee)
    ? (() => {
        if (isIdentifier(node.callee.property)) {
          // console.log("hello world")
          return `${(node.callee.object as any).name}.${node.callee.property.name}`;
        } else if (isStringLiteral(node.callee.property)) {
          // console["log"]("123");
          return `${(node.callee.object as any).name}["${node.callee.property.value}"]`;
        } else {
          return 'undefined';
        }
      })()
    : // log("123")
      (node.callee as t.Identifier).name;
  // 获取函数
  const func = path.visitor(path.createChild(node.callee));
  const args = node.arguments.map((arg) => path.visitor(path.createChild(arg)));
  const isValidFunction = isFunction(func) as boolean;
  let context: any = null;
  if (isMemberExpression(node.callee)) {
    if (!isValidFunction) {
      throw overrideStack(ErrIsNotFunction(functionName), stack, node.callee.property);
    } else {
      stack.push({
        filename: ANONYMOUS,
        stack: stack.currentStackName,
        location: node.callee.property.loc,
      });
    }
    context = path.visitor(path.createChild(node.callee.object));
  } else {
    if (!isValidFunction) {
      throw overrideStack(ErrIsNotFunction(functionName), stack, node);
    } else {
      stack.push({
        filename: ANONYMOUS,
        stack: stack.currentStackName,
        location: node.loc,
      });
    }
    const thisVar = scope.hasBinding(THIS);
    context = thisVar ? thisVar.value : null;
  }
  const result = func.apply(context, args);
  if (result instanceof Error) {
    result.stack = result.toString() + '\n' + stack.raw;
  }
  return result;
}
