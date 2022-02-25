import * as t from '@babel/types';
import { ScopeType } from '../../types';
import { Path } from '../../path';
import { ARGUMENTS, NEW, THIS } from '../../constants';
import { isAssignmentPattern, isIdentifier, isRestElement } from '../babelTypes';
import { Signal } from '../../signal';
import { defineFunction, This } from '../utils';

// TODO toString() 不准确

export function FunctionDeclaration(path: Path<t.FunctionDeclaration>) {
  const { node, scope } = path;
  const { name: functionName } = node.id!;
  // TODO support async function
  let func = FunctionExpression(path.createChild(node as any));
  defineFunction(func, node);
  // Function can repeat declaration
  scope.declareVar(functionName, func);
}

export function FunctionExpression(path: Path<t.FunctionExpression>) {
  const { node, scope, stack } = path;
  // 处理匿名函数
  const functionName = node.id ? node.id.name : '';

  const func = function (this: any, ...args) {
    stack.enter(functionName);

    // 判断是不是构造函数，如果是构造函数要返回一个实例
    const shouldReturnInstance = args.length && args[args.length - 1] instanceof This && args.pop();

    const funcScope = scope.createChild(ScopeType.Function);
    for (let i = 0; i < node.params.length; i++) {
      const param = node.params[i];
      if (isIdentifier(param)) {
        funcScope.declareLet(param.name, args[i]);
      } else if (isAssignmentPattern(param)) {
        // @es2015 default parameters
        path.visitor(path.createChild(param, funcScope, { value: args[i] }));
      } else if (isRestElement(param)) {
        // @es2015 rest parameters
        path.visitor(path.createChild(param, funcScope, { value: args.slice(i) }));
      }
    }

    funcScope.declareConst(THIS, this);
    // new.target  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target
    funcScope.declareConst(NEW, {
      target:
        this && this.__proto__ && this.__proto__.constructor
          ? this.__proto__.constructor
          : undefined,
    });
    funcScope.declareConst(ARGUMENTS, arguments);
    // funcScope.isolated = false;

    const result = path.visitor(path.createChild(node.body, funcScope));
    stack.leave();

    if (result instanceof Signal) {
      return result.value;
    } else if (shouldReturnInstance) {
      return this;
    } else {
      return result;
    }
  };

  defineFunction(func, node);

  if (functionName) {
    scope.declareVar(functionName, func);
  }

  return func;
}
