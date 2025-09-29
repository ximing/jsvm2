---
sidebar_position: 3
---

# Context API

Context 类提供了代码执行的沙箱环境，包含所有可访问的全局对象和变量。

## Context 类

```typescript
class Context {
  constructor(externalContext: ISandBox = {})
}
```

### 构造函数参数

- `externalContext` - 外部提供的沙箱对象

### 默认全局对象

Context 实例默认包含以下标准 ECMAScript 对象：

#### 基本值
- `Infinity`
- `NaN`
- `undefined`

#### 全局函数
- `isFinite()`
- `isNaN()`
- `parseFloat()`
- `parseInt()`
- `decodeURI()`
- `decodeURIComponent()`
- `encodeURI()`
- `encodeURIComponent()`

#### 构造函数
- `Object`
- `Function`
- `Boolean`
- `Number`
- `String`
- `Array`
- `Date`
- `RegExp`

#### 错误对象
- `Error`
- `EvalError`
- `RangeError`
- `ReferenceError`
- `SyntaxError`
- `TypeError`
- `URIError`

#### 实用对象
- `Math`
- `JSON`
- `console`

### 现代特性支持

如果宿主环境支持，还会包含：

- `Symbol`
- `Promise`
- `Map` / `Set`
- `WeakMap` / `WeakSet`
- `Proxy` / `Reflect`
- 各种 TypedArray

### 使用示例

```javascript
import { createContext, runInContext } from 'jsvm2';
import { parse } from '@babel/parser';

// 创建自定义上下文
const context = createContext({
  // 自定义变量
  appName: 'MyApp',
  version: '1.0.0',

  // 自定义函数
  log: (msg) => console.log('[App]', msg),

  // 受限的 Math 对象
  Math: {
    abs: Math.abs,
    max: Math.max,
    min: Math.min
  }
});

// 执行代码
const code = `
  log('应用启动: ' + appName + ' v' + version);
  Math.abs(-42);
`;

const ast = parse(code);
const result = runInContext(ast, context);
// 输出: [App] 应用启动: MyApp v1.0.0
console.log(result); // 42
```

### 安全特性

- **完全隔离**：沙箱代码无法访问宿主环境的全局变量
- **原型保护**：无法修改内置对象的原型链
- **受控访问**：只能访问显式提供的 API

### 性能优化

- **复用上下文**：避免频繁创建新的 Context 实例
- **最小化沙箱**：只包含必要的全局对象
- **预创建对象**：将复杂对象预先创建并放入上下文