---
sidebar_position: 4
---

# Scope API

Scope 类管理 JSVM2 中的变量作用域和绑定关系。

## Scope 类

```typescript
class Scope {
  static createRoot(context?: Context): Scope

  declareVar(name: string, value?: any): void
  declareConst(name: string, value: any): void
  declareLet(name: string, value?: any): void

  hasOwnBinding(name: string): Variable | undefined
  getBinding(name: string): Variable | undefined
  setBinding(name: string, value: any): void
}
```

## 作用域层次

JSVM2 使用作用域链来管理变量的可见性和生命周期：

```javascript
// 全局作用域 (根作用域)
var globalVar = "全局变量";

function outerFunction() {
  // 函数作用域
  var outerVar = "外层变量";

  function innerFunction() {
    // 内层函数作用域
    var innerVar = "内层变量";

    // 可以访问所有上层作用域的变量
    console.log(globalVar); // "全局变量"
    console.log(outerVar);  // "外层变量"
    console.log(innerVar);  // "内层变量"
  }
}
```

## 变量声明类型

### var 声明
- 函数作用域
- 允许重复声明
- 存在变量提升

```javascript
function example() {
  console.log(x); // undefined (不是 ReferenceError)
  var x = 5;

  if (true) {
    var x = 10; // 同一个变量
  }
  console.log(x); // 10
}
```

### let 声明
- 块级作用域
- 不允许重复声明
- 存在暂时性死区

```javascript
function example() {
  // console.log(y); // ReferenceError

  let y = 5;
  if (true) {
    let y = 10; // 不同的变量
    console.log(y); // 10
  }
  console.log(y); // 5
}
```

### const 声明
- 块级作用域
- 必须初始化
- 不能重新赋值

```javascript
function example() {
  const PI = 3.14159;
  // PI = 3.14; // TypeError

  const obj = { name: "test" };
  obj.name = "updated"; // 允许，只是对象内容改变
}
```

## 作用域创建

### 根作用域
```javascript
import { Scope } from 'jsvm2';

// 创建根作用域
const rootScope = Scope.createRoot();

// 声明全局变量
rootScope.declareVar('globalVar', 'hello');
rootScope.declareConst('PI', 3.14159);
```

### 子作用域
```javascript
// 创建子作用域（通常在函数调用时）
const functionScope = rootScope.createChild();

// 在子作用域中声明变量
functionScope.declareVar('localVar', 'world');

// 子作用域可以访问父作用域的变量
const globalValue = functionScope.getBinding('globalVar'); // 'hello'
```

## 变量查找

作用域链遵循词法作用域规则：

```javascript
// 变量查找顺序：
// 1. 当前作用域
// 2. 父作用域
// 3. 祖父作用域
// ...
// n. 全局作用域

function outer() {
  var x = 'outer';

  function middle() {
    var y = 'middle';

    function inner() {
      var z = 'inner';

      // 查找 z: 在当前作用域找到
      console.log(z); // 'inner'

      // 查找 y: 在父作用域找到
      console.log(y); // 'middle'

      // 查找 x: 在祖父作用域找到
      console.log(x); // 'outer'

      // 查找 w: 一直找到全局作用域都没找到
      // console.log(w); // ReferenceError
    }
  }
}
```

## 闭包支持

JSVM2 正确实现了闭包机制：

```javascript
function createCounter(start) {
  let count = start;

  return function increment() {
    count++;
    return count;
  };
}

const counter1 = createCounter(0);
const counter2 = createCounter(10);

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 11
console.log(counter1()); // 3
```

每个函数都保持对其创建时的作用域的引用，即使外层函数已经执行完毕。

## 变量绑定

### 获取变量
```javascript
// 在当前作用域查找
const localBinding = scope.hasOwnBinding('varName');

// 在作用域链中查找
const binding = scope.getBinding('varName');

if (binding) {
  console.log(binding.value);
}
```

### 设置变量
```javascript
// 更新已存在的变量
scope.setBinding('varName', newValue);

// 如果变量不存在，会沿作用域链向上查找
// 如果都找不到，在严格模式下会抛出 ReferenceError
```

## 作用域类型

JSVM2 支持以下作用域类型：

- **Global** - 全局作用域
- **Function** - 函数作用域
- **Block** - 块级作用域 (let/const)
- **Catch** - catch 子句作用域
- **With** - with 语句作用域（不推荐使用）

## 实际应用

在 JSVM2 的实现中，每当遇到以下情况时会创建新的作用域：

- 函数调用
- 块语句（包含 let/const 声明时）
- try-catch 语句的 catch 子句
- with 语句（严格模式下禁用）

这确保了变量的正确隔离和 JavaScript 语义的准确实现。