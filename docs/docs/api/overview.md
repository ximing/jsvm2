---
sidebar_position: 1
---

# API 概览

JSVM2 提供了简洁而强大的 API，让你能够轻松地在沙箱环境中执行 JavaScript 代码。

## 核心 API

### 快速执行函数

```typescript
function run(ast: any, context?: Context): any
```

直接执行 AST 并返回结果，适用于简单的代码执行场景。

### 沙箱执行函数

```typescript
function runInContext(ast: any, context?: Context): any
```

在指定的沙箱上下文中执行 AST，支持模块化导出。

### 上下文创建函数

```typescript
function createContext(sandbox?: ISandBox): Context
```

创建一个新的执行上下文，可以自定义沙箱环境。

## 类型定义

### ISandBox 接口

```typescript
interface ISandBox {
  [key: string]: any;
}
```

沙箱环境对象，定义了代码执行时可访问的全局变量和函数。

### Context 类

```typescript
class Context {
  constructor(externalContext: ISandBox = {})
}
```

执行上下文类，包含了代码执行所需的全局环境。

## 基本用法

### 执行表达式

```javascript
import { run } from 'jsvm2';
import { parse } from '@babel/parser';

// 解析代码为 AST
const ast = parse('1 + 2 * 3');

// 执行并获取结果
const result = run(ast);
console.log(result); // 7
```

### 自定义沙箱环境

```javascript
import { createContext, runInContext } from 'jsvm2';
import { parse } from '@babel/parser';

// 创建自定义沙箱
const sandbox = createContext({
  x: 10,
  y: 20,
  multiply: (a, b) => a * b
});

// 执行代码
const ast = parse('multiply(x, y)');
const result = runInContext(ast, sandbox);
console.log(result); // 200
```

### 模块化执行

```javascript
import { createContext, runInContext } from 'jsvm2';
import { parse } from '@babel/parser';

const code = `
  function add(a, b) {
    return a + b;
  }

  module.exports = { add };
`;

const ast = parse(code, { sourceType: 'module' });
const context = createContext();
const moduleExports = runInContext(ast, context);

console.log(moduleExports.add(2, 3)); // 5
```

## 错误处理

所有 API 都会抛出标准的 JavaScript 错误：

```javascript
import { run } from 'jsvm2';
import { parse } from '@babel/parser';

try {
  const ast = parse('undefinedVariable');
  run(ast);
} catch (error) {
  console.log(error instanceof ReferenceError); // true
  console.log(error.message); // "undefinedVariable is not defined"
}
```

## 内置全局对象

### 标准 ECMAScript 对象

Context 默认包含以下标准对象：

- **基本值**: `Infinity`, `NaN`, `undefined`
- **全局函数**: `isFinite`, `isNaN`, `parseFloat`, `parseInt`, `decodeURI`, 等
- **构造函数**: `Object`, `Function`, `Boolean`, `Number`, `String`, `Array`, 等
- **错误对象**: `Error`, `TypeError`, `ReferenceError`, 等
- **实用对象**: `Math`, `Date`, `RegExp`, `JSON`

### Node.js 环境对象

在 Node.js 环境中，还包含：

- `console` - 控制台输出
- `setTimeout` / `clearTimeout` - 定时器
- `setInterval` / `clearInterval` - 间隔定时器

### 现代 JavaScript 特性

如果宿主环境支持，还会包含：

- `Symbol` - 符号类型
- `Promise` - 异步处理
- `Map` / `Set` - 集合类型
- `Proxy` / `Reflect` - 元编程
- 各种 TypedArray 类型

## 安全限制

### 隔离保护

- 沙箱代码无法访问宿主环境的全局变量
- 无法修改原生对象的原型链
- 无法访问 Node.js 的模块系统（除非显式提供）

### 资源控制

虽然 JSVM2 提供了执行隔离，但不包含以下限制（需要在应用层实现）：

- 执行时间限制
- 内存使用限制
- 无限循环检测

## 性能考虑

### 执行效率

JSVM2 的执行速度比原生 JavaScript 慢，主要原因：

1. AST 解释执行而非编译
2. 额外的安全检查和作用域管理
3. 访问器模式的开销

### 优化建议

1. **复用 Context**: 避免频繁创建新的上下文
2. **预编译 AST**: 缓存解析后的 AST 对象
3. **最小化沙箱**: 只包含必要的全局对象
4. **批量执行**: 将多个操作合并到一次执行中

```javascript
// 好的做法
const context = createContext(/* ... */);
const asts = codes.map(code => parse(code));

const results = asts.map(ast => runInContext(ast, context));

// 避免的做法
const results = codes.map(code => {
  const context = createContext(/* ... */); // 每次都创建新上下文
  const ast = parse(code); // 每次都解析
  return runInContext(ast, context);
});
```

## 下一步

- [VM API](./vm) - 详细了解虚拟机 API
- [Context API](./context) - 深入学习上下文管理
- [Scope API](./scope) - 了解作用域系统