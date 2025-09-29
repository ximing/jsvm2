---
sidebar_position: 2
---

# VM API

虚拟机 API 是 JSVM2 的核心接口，提供了代码执行的主要功能。

## run()

直接执行 AST 并返回结果。

```typescript
function run(ast: any, context?: Context): any
```

### 参数

- `ast` - Babel 解析的 AST 对象
- `context` - 可选的执行上下文

### 返回值

执行结果，可以是任何 JavaScript 值。

### 示例

```javascript
import { run } from 'jsvm2';
import { parse } from '@babel/parser';

const ast = parse('2 + 3');
const result = run(ast);
console.log(result); // 5
```

## runInContext()

在指定的沙箱上下文中执行 AST，支持模块化导出。

```typescript
function runInContext(ast: any, context?: Context): any
```

### 参数

- `ast` - Babel 解析的 AST 对象
- `context` - 执行上下文，默认为新创建的空上下文

### 返回值

- 如果代码中有 `module.exports`，返回导出的内容
- 否则返回最后一个表达式的值

### 示例

```javascript
import { runInContext, createContext } from 'jsvm2';
import { parse } from '@babel/parser';

const context = createContext({ x: 10 });
const ast = parse('x * 2');
const result = runInContext(ast, context);
console.log(result); // 20
```

## createContext()

创建一个新的执行上下文。

```typescript
function createContext(sandbox?: ISandBox): Context
```

### 参数

- `sandbox` - 可选的沙箱对象，定义可访问的全局变量

### 返回值

新创建的 Context 实例。

### 示例

```javascript
import { createContext } from 'jsvm2';

const context = createContext({
  name: 'JSVM2',
  version: '1.2.5',
  customFunction: () => 'Hello!'
});
```