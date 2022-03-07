import * as t from '@babel/types';
import { ErrCanNotReadProperty } from '../../error';
import { Path } from '../../path';
import { isCallExpression, isIdentifier } from '../babelTypes';
import { isFunction, runtimeThis } from '../utils';

function defineCtx(target: any, parent: any, ctx: any) {
  if (isFunction(target) && parent && isCallExpression(parent.node)) {
    // (parent.node as any).$ctx$ = ctx;
    runtimeThis.set(parent.node, ctx);
    // parent.scope.declareConst(THIS, obj);
  }
}
export function MemberExpression(path: Path<t.MemberExpression>) {
  const { node, ctx, parent } = path;
  // https://doc.esdoc.org/github.com/mason-lang/esast/class/src/ast.js~MemberExpression.html
  // If computed === true, object[property]. Else, object.property -- meaning property should be an Identifier.
  const { object, property, computed } = node;
  const propertyName: string = computed
    ? path.visitor(path.createChild(property))
    : (property as t.Identifier).name;
  const obj = path.visitor(path.createChild(object));
  if (obj === undefined) {
    throw ErrCanNotReadProperty(propertyName, 'undefined');
  }
  if (obj === null) {
    if (ctx.wxml) return undefined;
    throw ErrCanNotReadProperty(propertyName, 'null');
  }

  /*
      var arrayProto = Array.prototype,
      funcProto = Function.prototype,
      objectProto = Object.prototype;
      objectProto.assign  // obj instanceof Prototype
  * */
  // if (obj instanceof Prototype) {
  //   // @ts-ignore
  //   const target = obj.constructor.prototype[propertyName];
  //   defineCtx(target, parent, obj);
  //   return target;
  // }
  // const isPrototype = propertyName === 'prototype';
  // if (isPrototype) {
  //   return new Prototype(obj);
  // }
  /*
  function MyFunction(){
  }
  MyFunction.prototype = {
    say: function(){
    }
  };
  * */
  // Date 等返回的时候，不能bind, 否则静态函数找不到 如 Date.now
  // 返回 call 的时候
  //   1. 要bind this，调用的地方不需要 apply
  //   2. 不bind this，调用的地方apply
  // 综上，member的时候不处理bind，统一在调用的地方处理
  const target = obj[propertyName];
  // 处理链式调用，比如 d().c()，CallExpression获取C之后再执行，需要获取C的Context，这时候会重复执行一遍d() 所以需要将ctx提前返回回去
  defineCtx(target, parent, obj);
  return target;
  // if (propertyName === 'call') {
  //   console.log(
  //     'propertyName',
  //     propertyName,
  //     isPrototype,
  //     target === Function.prototype[propertyName],
  //     obj
  //   );
  // }
  // 处理 call apply之类的函数  Object.prototype.call
  // if (target === Function.prototype[propertyName]) {
  //   return target;
  // }
  // return target instanceof Prototype ? target : isFunction(target) ? target.bind(obj) : target;
}
