---
sidebar_position: 2
---

# 基础用法

本节将介绍 JSVM2 的基本使用方法，包括如何执行代码、创建沙箱环境以及处理执行结果。

## 简单执行

最简单的使用方式是直接调用 `run` 函数：

```javascript
import { run } from 'jsvm2';

// 执行基本表达式
const result1 = run('1 + 2');
console.log(result1); // 3

// 执行函数调用
const result2 = run('Math.max(1, 2, 3)');
console.log(result2); // 3

// 执行字符串操作
const result3 = run('"Hello".toUpperCase()');
console.log(result3); // "HELLO"
```

## 创建沙箱环境

使用 `createContext` 和 `runInContext` 可以创建自定义的执行环境：

```javascript
import { createContext, runInContext } from 'jsvm2';

// 创建自定义沙箱
const sandbox = createContext({
  name: 'JSVM2',
  version: '1.2.5',
  customFunction: () => 'Hello from sandbox!'
});

// 在沙箱中执行代码
const result = runInContext(`
  const greeting = customFunction();
  name + ' v' + version + ': ' + greeting;
`, sandbox);

console.log(result); // "JSVM2 v1.2.5: Hello from sandbox!"
```

## 执行复杂代码

JSVM2 支持执行包含函数、对象、循环等复杂结构的代码：

```javascript
import { run } from 'jsvm2';

const code = `
  function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push(fibonacci(i));
  }

  result.join(', ');
`;

const result = run(code);
console.log(result); // "0, 1, 1, 2, 3, 5, 8, 13, 21, 34"
```

## 处理变量作用域

JSVM2 正确处理变量作用域和闭包：

```javascript
import { run } from 'jsvm2';

const code = `
  function createCounter(start) {
    let count = start;
    return function() {
      return ++count;
    };
  }

  const counter = createCounter(10);
  [counter(), counter(), counter()];
`;

const result = run(code);
console.log(result); // [11, 12, 13]
```

## ES2015+ 语法支持

JSVM2 支持现代 JavaScript 语法：

```javascript
import { run } from 'jsvm2';

// 箭头函数和数组方法
const result1 = run(`
  const numbers = [1, 2, 3, 4, 5];
  numbers
    .filter(x => x % 2 === 0)
    .map(x => x * 2);
`);
console.log(result1); // [4, 8]

// 解构赋值
const result2 = run(`
  const obj = { a: 1, b: 2, c: 3 };
  const { a, ...rest } = obj;
  [a, rest];
`);
console.log(result2); // [1, { b: 2, c: 3 }]

// let/const 声明
const result3 = run(`
  const arr = [];
  for (let i = 0; i < 3; i++) {
    arr.push(() => i);
  }
  arr.map(fn => fn());
`);
console.log(result3); // [0, 1, 2]
```

## 错误处理

JSVM2 会抛出标准的 JavaScript 错误：

```javascript
import { run } from 'jsvm2';

try {
  run('throw new Error("自定义错误")');
} catch (error) {
  console.log(error.message); // "自定义错误"
}

try {
  run('undefinedVariable.method()');
} catch (error) {
  console.log(error instanceof ReferenceError); // true
}
```

## 模块化支持

JSVM2 支持模块化的导出：

```javascript
import { runInContext, createContext } from 'jsvm2';

const code = `
  // 导出对象
  module.exports.add = function(a, b) {
    return a + b;
  };

  module.exports.multiply = function(a, b) {
    return a * b;
  };
`;

const context = createContext();
const moduleExports = runInContext(code, context);

console.log(moduleExports.add(2, 3)); // 5
console.log(moduleExports.multiply(4, 5)); // 20
```

## 限制访问

通过自定义沙箱，你可以限制代码能访问的功能：

```javascript
import { createContext, runInContext } from 'jsvm2';

// 创建受限的沙箱环境
const restrictedSandbox = createContext({
  // 只提供基本的数学函数
  Math: {
    abs: Math.abs,
    max: Math.max,
    min: Math.min
  },
  // 自定义日志函数
  log: (msg) => console.log('[Sandbox]', msg)
});

const result = runInContext(`
  const value = Math.abs(-42);
  log('计算结果: ' + value);
  value;
`, restrictedSandbox);

// 输出: [Sandbox] 计算结果: 42
console.log(result); // 42
```

## 性能考虑

虽然 JSVM2 提供了强大的沙箱功能，但执行性能会比原生 JavaScript 慢一些。对于性能敏感的场景，建议：

1. 缓存编译结果
2. 避免在循环中重复创建沙箱
3. 合理选择需要沙箱执行的代码范围

```javascript
import { createContext } from 'jsvm2';

// 好的做法：复用沙箱环境
const sharedSandbox = createContext({ /* ... */ });

function executeUserCode(code) {
  return runInContext(code, sharedSandbox);
}

// 避免每次都创建新的沙箱
function executeBatch(codes) {
  return codes.map(code => executeUserCode(code));
}
```

## 下一步

- [查看更多示例](./examples) - 了解实际应用场景
- [API 参考](../api/overview) - 深入了解所有可用 API