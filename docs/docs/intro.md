---
sidebar_position: 1
---

# 介绍

JSVM2 是一个基于 JavaScript 实现的 JavaScript 解释器，它提供了一个完全隔离的沙箱环境来执行 JavaScript 代码。

## 什么是 JSVM2？

JSVM2（JavaScript Virtual Machine 2）是一个纯 JavaScript 实现的 ECMAScript 解释器。它的主要特点包括：

- **安全沙箱**：完全隔离的执行环境，防止恶意代码访问宿主环境
- **标准兼容**：严格遵循 ECMAScript 规范，支持 ES5 完整特性
- **现代语法**：支持部分 ES2015+ 特性，如 let/const、箭头函数等
- **轻量级**：纯 JavaScript 实现，无需额外的运行时依赖

## 为什么选择 JSVM2？

### 🔒 安全执行
当你需要执行不可信的 JavaScript 代码时，JSVM2 提供了一个安全的沙箱环境，确保代码无法访问或修改宿主环境的任何内容。

### 🚀 简单易用
只需几行代码就能开始使用，无需复杂的配置过程。

### 📊 可控环境
你可以完全控制沙箱环境中的全局对象和 API，只暴露你需要的功能。

### 🧪 测试友好
非常适合用于代码执行引擎、在线代码编辑器、插件系统等场景。

## 快速开始

让我们从一个简单的例子开始：

```javascript
import { run } from 'jsvm2';

// 执行简单的 JavaScript 代码
const result = run(`
  const message = 'Hello, JSVM2!';
  message.toUpperCase();
`);

console.log(result); // 输出: 'HELLO, JSVM2!'
```

## 主要特性

### 支持的语法特性

#### ES5 完整支持
- ✅ 所有基本表达式和语句
- ✅ 函数声明和表达式
- ✅ 对象和数组字面量
- ✅ 作用域链和闭包
- ✅ try/catch 异常处理
- ✅ 循环语句（for、while、do-while、for-in）

#### ES2015+ 部分支持
- ✅ let/const 声明
- ✅ 箭头函数
- ✅ 解构赋值
- ✅ for-of 循环
- ✅ 扩展运算符
- ✅ 默认参数

### 安全特性
- 完全隔离的执行环境
- 自定义全局对象
- 可控的 API 暴露
- 防止原型链污染

## 应用场景

JSVM2 适用于以下场景：

- **在线代码编辑器**：为用户提供安全的代码执行环境
- **插件系统**：安全地执行第三方插件代码
- **配置引擎**：执行动态配置脚本
- **教学工具**：JavaScript 语言特性演示
- **代码评测**：安全地执行和测试用户提交的代码

## 下一步

- [安装 JSVM2](./getting-started/installation)
- [基础用法](./getting-started/basic-usage)
- [查看示例](./getting-started/examples)
- [API 参考](./api/overview)