import * as types from '@babel/types';
import { ScopeType } from '../../types';
import { Path } from '../../path';
import { isAssignmentPattern, isIdentifier, isRestElement, isSpreadElement } from '../babelTypes';
import { ARGUMENTS, THIS } from '../../constants';
import { Signal } from '../../signal';
import { defineFunction } from '../utils';

export function ObjectExpression(path: Path<types.ObjectExpression>) {
  const { node, scope } = path;
  const object = {};
  const newScope = scope.createChild(ScopeType.Function);
  // const computedProperties: Array<types.ObjectProperty | types.ObjectMethod> = [];

  node.properties.forEach((property) => {
    // const tempProperty = property as types.ObjectMethod | types.ObjectProperty;
    // if (tempProperty.computed === true) {
    //   computedProperties.push(tempProperty);
    //   return;
    // }
    if (isSpreadElement(property)) {
      const obj = path.visitor(path.createChild(property));
      Object.assign(object, obj);
      return;
    }
    path.visitor(path.createChild(property, newScope, { object }));
  });
  // eval the computed properties
  // computedProperties.forEach((property) => {
  //   path.visitor(path.createChild(property, newScope, { object }));
  // });
  return object;
}
/*
  var f = {
    a(){}, ObjectMethod
    c : ()=>{}, ObjectProperty
    b:1 ObjectProperty
    [d]:1
  }
* */
export function ObjectProperty(path: Path<types.ObjectProperty>) {
  const { node, ctx, scope } = path;
  const { object } = ctx;
  const { value, key } = node;
  let _key = '';
  if (isIdentifier(key) && !node.computed) {
    _key = key.name;
    // scope.declareVar(key.name, val);
  } else {
    _key = path.visitor(path.createChild(node.key));
  }
  object[_key] = path.visitor(path.createChild(value, scope, { functionName: _key }));
}

export function ObjectMethod(path: Path<types.ObjectMethod>) {
  const { node, scope, stack, ctx } = path;
  // If computed === true, object[property]. Else, object.property -- meaning property should be an Identifier.
  const methodName: string =
    !node.computed && isIdentifier(node.key)
      ? node.key.name
      : path.visitor(path.createChild(node.key));
  // 这里改动要同步到function FunctionExpression 一份
  // ObjectMethod不能创建一个实例，ObjectProperty.FunctionExpression 可以 所以下面不用搞实例的问题
  const method = function (this: any) {
    stack.enter('Object.' + methodName);
    const args = [].slice.call(arguments);
    const newScope = scope.createChild(ScopeType.Function);
    newScope.declareConst(THIS, this);
    // eslint-disable-next-line prefer-rest-params
    newScope.declareConst(ARGUMENTS, arguments);
    // define arguments
    node.params.forEach((param, i) => {
      if (isIdentifier(param)) {
        newScope.declareLet(param.name, args[i]);
      } else if (isAssignmentPattern(param)) {
        // @es2015 default parameters
        path.visitor(path.createChild(param, newScope, { value: args[i] }));
      } else if (isRestElement(param)) {
        // @es2015 rest parameters
        path.visitor(path.createChild(param, newScope, { value: args.slice(i) }));
      } else {
        console.error('ObjectMethod: 无效参数');
      }
    });
    const result = path.visitor(path.createChild(node.body, newScope));
    stack.leave();
    if (Signal.isReturn(result)) {
      return result.value;
    }
  };
  defineFunction(method, node, methodName);

  const objectKindMap = {
    get() {
      Object.defineProperty(ctx.object, methodName, { get: method });
      // scope.declareConst(methodName, method);
    },
    set() {
      Object.defineProperty(ctx.object, methodName, { set: method });
    },
    method() {
      ctx.object[methodName] = method;
      // Object.defineProperty(ctx.object, methodName, { value: method });
    },
  };

  const definer = objectKindMap[node.kind];

  if (definer) {
    definer();
  }
}
