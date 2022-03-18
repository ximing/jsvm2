import * as t from '@babel/types';
import { Path } from '../../path';
import { isIdentifier, isMemberExpression, isStringLiteral, isThisExpression } from '../babelTypes';
import { isFunction, overrideStack, runtimeThis } from '../utils';
import { ErrIsNotFunction } from '../../error';
import { ANONYMOUS } from '../../constants';

// console.log("123")
// console['log']("123")
// log("12")
// Object.prototype.hasOwnProperty.call(g, w)
export function CallExpression(path: Path<t.CallExpression>) {
  const { node, stack } = path;
  let propertyName = '';
  const functionName: string = isMemberExpression(node.callee)
    ? (() => {
        const callee = isThisExpression(node.callee.object)
          ? 'this'
          : (node.callee.object as any).name;
        if (isIdentifier(node.callee.property)) {
          // console.log("hello world")
          propertyName = node.callee.property.name;
          return `${callee}.${propertyName}`;
        } else if (isStringLiteral(node.callee.property)) {
          // console["log"]("123");
          propertyName = node.callee.property.value;
          return `${callee}["${propertyName}"]`;
        }
        {
          return 'undefined';
        }
      })()
    : // log("123")
      (node.callee as t.Identifier).name;
  /*
   * 有三种情况
   * 1. 直接执行函数 setTimeout(()=>{},0)        this在函数定义时
   * 2. plain Object 内执行对象                  运行时再确定
   *    var obj = {
   *       fn(){},                             运行时再确定  MemberExpression
   *       fn:()=>{}  // 这种this会被babel处理， 可以不考虑
   *       fn:function(){}                     运行时再确定  MemberExpression
   *     }
   *    obj.fn();
   * 3. class 情况
   *    var A = function () {
        function A() {}
        var _proto = A.prototype;
        _proto.b = function b() {               jsvm运行时确定  MemberExpression
          var _this = this;
          var fn = function fn() {
            return _this;
          };
          return fn();
        };
        _proto.c = function c() {
          return this;
        };
        return A;
      }();
   * 4. class constructor
   *    new  jsvm运行时确定  MemberExpression
   * */
  // 顺序不能乱，需要对执行的函数的cts做提前确定，
  // 参数里面也可能有函数表达式 比如 obj2.doFoo(obj.foo)
  // 左值也可能有表达式 var a; (a=b).fn.apply(a);
  // 所以先取左值，然后memberExpression里面作判定，已经有值的时候就不重复设置了，在获取context的时候取完销毁，从而做到一次运行只取一次
  const func = path.visitor(path.createChild(node.callee));
  const args = node.arguments.map((arg) => path.visitor(path.createChild(arg)));
  const isValidFunction = isFunction(func) as boolean;
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
    // context = path.visitor(path.createChild(node.callee.object));
  } else {
    if (!isValidFunction) {
      throw overrideStack(ErrIsNotFunction(functionName), stack, node);
    } else {
      stack.push({
        filename: ANONYMOUS,
        stack: stack.currentStackName,
        location: node.loc,
      });
      // const thisVar = scope.hasOwnBinding(THIS);
      // context = thisVar ? thisVar.value : null;
    }
  }
  // const thisVar = scope.hasOwnBinding(THIS);
  // let context: any = (node as any).$ctx$ || functionThis.get(func) || undefined;
  // let context: any = runtimeThis.get(node) || functionThis.get(func) || undefined;
  let context: any = undefined;
  if (runtimeThis.has(path)) {
    context = runtimeThis.get(path);
    runtimeThis.delete(path);
  }
  try {
    const result = func.apply(context, args);
    if (result instanceof Error) {
      result.stack = result.toString() + '\n' + stack.raw;
    }
    return result;
  } catch (err) {
    console.error(stack.raw);
    console.error(err);
    throw err;
  }
}
