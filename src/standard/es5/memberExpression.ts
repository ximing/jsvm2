import * as t from '@babel/types';
import { ErrCanNotReadProperty } from '../../error';
import { Path } from '../../path';
import { isIdentifier } from '../babelTypes';
import { isFunction, Prototype } from '../utils';

export function MemberExpression(path: Path<t.MemberExpression>) {
  const { node } = path;
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
    throw ErrCanNotReadProperty(propertyName, 'null');
  }
  /*
  function MyFunction(){
  }
  MyFunction.prototype = {
    say: function(){
    }
  };
  * */
  const isPrototype = propertyName === 'prototype' && isIdentifier(property);
  const target = isPrototype ? new Prototype(obj) : obj[propertyName];
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
  if (target === Function.prototype[propertyName]) {
    return target;
  }
  return target instanceof Prototype ? target : isFunction(target) ? target.bind(obj) : target;
}
