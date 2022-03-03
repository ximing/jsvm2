import * as types from '@babel/types';
import { ScopeType } from '../../types';
import { Path } from '../../path';
import { isIdentifier, isSpreadElement } from '../babelTypes';
import { THIS } from '../../constants';
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
  const { node, ctx } = path;
  const { object } = ctx;
  const { value, key } = node;
  const val = path.visitor(path.createChild(value));
  if (isIdentifier(key) && !node.computed) {
    object[key.name] = val;
    // scope.declareVar(key.name, val);
  } else {
    object[path.visitor(path.createChild(node.key))] = val;
  }
}

export function ObjectMethod(path: Path<types.ObjectMethod>) {
  const { node, scope, stack, ctx } = path;
  // If computed === true, object[property]. Else, object.property -- meaning property should be an Identifier.
  const methodName: string =
    !node.computed && isIdentifier(node.key)
      ? node.key.name
      : path.visitor(path.createChild(node.key));
  const method = function (this: any) {
    stack.enter('Object.' + methodName);
    const args = [].slice.call(arguments);
    const newScope = scope.createChild(ScopeType.Function);
    newScope.declareConst(THIS, this);
    // define arguments
    node.params.forEach((param, i) => {
      newScope.declareLet((param as types.Identifier).name, args[i]);
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
