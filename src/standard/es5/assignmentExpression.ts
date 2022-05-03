import * as types from '@babel/types';
import { ErrCanNotSetProperty, ErrNotDefined } from '../../error';

import { Path } from '../../path';
import { Kind, Var } from '../../var';
import { isIdentifier, isMemberExpression } from '../babelTypes';
import { overrideStack } from '../utils';

export const AssignmentExpressionMap = {
  '=': ($var: Var, v) => {
    $var.value = v;
    return v;
  },
  '+=': ($var: Var, v) => {
    $var.value += v;
    return $var.value;
  },
  '-=': ($var: Var, v) => {
    $var.value -= v;
    return $var.value;
  },
  '*=': ($var: Var, v) => {
    $var.value *= v;
    return $var.value;
  },
  '/=': ($var: Var, v) => {
    $var.value /= v;
    return $var.value;
  },
  '%=': ($var: Var, v) => {
    $var.value %= v;
    return $var.value;
  },
  '<<=': ($var: Var, v) => {
    $var.value = $var.value << v;
    return $var.value;
  },
  '>>=': ($var: Var, v) => {
    $var.value = $var.value >> v;
    return $var.value;
  },
  '>>>=': ($var: Var, v) => {
    $var.value = $var.value >>> v;
    return $var.value;
  },
  '&=': ($var: Var, v) => {
    $var.value = $var.value & v;
    return $var.value;
  },
  '^=': ($var: Var, v) => {
    $var.value = $var.value ^ v;
    return $var.value;
  },
  '|=': ($var: Var, v) => {
    $var.value = $var.value | v;
    return $var.value;
  },
  '**=': ($var: Var, v) => {
    $var.value = Math.pow($var.value, v);
    return $var.value;
  },
};

export function AssignmentExpression(path: Path<types.AssignmentExpression>) {
  const { node, scope, ctx, stack } = path;
  // @ts-ignore
  let $var: Var = {
    kind: Kind.var,
    // @ts-ignore
    set value(value: any) {
      throw new Error('no implement');
    },
    get value() {
      return undefined;
    },
  };
  let rightValue;

  if (isIdentifier(node.left)) {
    const { name } = node.left;
    const v = scope.hasBinding(name);
    rightValue = path.visitor(path.createChild(node.right));

    if (!v) {
      if (ctx.wxml) {
        // 非严格模式
        const globalScope = scope.global;
        globalScope.declareVar(name, path.visitor(path.createChild(node.right)));
        const globalVar = globalScope.hasBinding(name);
        if (globalVar) {
          $var = globalVar;
        } else {
          throw overrideStack(ErrNotDefined(name), path.stack, node.right);
        }
      } else {
        throw overrideStack(ErrNotDefined(name), path.stack, node.right);
      }
    } else {
      $var = v as Var<any>;
      /**
       * const test = 123;
       * test = 321 // it should throw an error
       */
      if ($var.kind === Kind.const) {
        throw overrideStack(
          new TypeError('Assignment to constant variable.'),
          path.stack,
          node.left
        );
      }
    }
  } else if (isMemberExpression(node.left)) {
    /*
     * a.x = a = {n: 2};
     * 这一行比较复杂。先获取等号左侧的a.x，但a.x并不存在，于是JS为（堆内存中的）对象创建一个新成员x，这个成员的初始值为undefined，
     * （这也是为什么直接引用一个未定义的变量会报错，但是直接引用一个对象的不存在的成员时，会返回undefined.）
     * 创建完成后，目标指针已经指向了这个新成员x，并会先挂起，等号右侧的内容有结果了，便完成赋值。
     * 接着执行赋值语句的右侧，发现a={n:2}是个简单的赋值操作，于是a的新值等于了{n:2}。
     * 这里特别注意，这个a已经不是开头的那个a，而是一个全新的a,这个新a指针已经不是指向原来的值的那个堆内存，而是分配了一个新的堆内存。
     * 但是原来旧的堆内存因为还有b在占用，所以并未被回收。
     * 然后，将这个新的对象a的堆内存指针，赋值给了刚才挂起的新成员x,此时，对象成员x便等于了新的对象a。
     * 所以，现在b={n:1,x:{n:2}};a={n:2};
     * */
    const left = node.left;
    //   this.xx = 1;
    //     left
    // object property
    const object: any = path.visitor(path.createChild(left.object));
    // 考虑 this.xxx(); 情况
    /*
    * function Child (name, age) {
          Parent.call(this, name);
          this.age = age;
          this.n = this.getName(); // <-- 这里
      }
    * */
    rightValue = path.visitor(path.createChild(node.right));

    const property: string = left.computed
      ? path.visitor(path.createChild(left.property))
      : (left.property as types.Identifier).name;

    // @ts-ignore
    $var = {
      kind: Kind.var,
      set value(value: any) {
        // if (object instanceof Prototype) {
        //   // subClass.prototype.aaa = 1;
        //   const Constructor = object.constructor;
        //   Constructor.prototype[property] = value;
        // } else if (object[property] instanceof Prototype) {
        //   // subClass.prototype = Object.create()
        //   const Constructor = object[property].constructor;
        //   Constructor.prototype = value;
        // } else {
        //   object[property] = value;
        // }
        // eslint-disable-next-line
        if (object == null) {
          throw overrideStack(
            ErrCanNotSetProperty(property, typeof object),
            stack,
            node
          );
        } else {
          object[property] = value;
        }
        object[property] = value;
      },
      get value() {
        return object[property];
      },
    };
  }

  return AssignmentExpressionMap[node.operator]($var, rightValue);
}
