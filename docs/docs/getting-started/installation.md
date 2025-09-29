---
sidebar_position: 1
---

# 安装

JSVM2 可以通过 npm 或 yarn 安装，支持 Node.js 和浏览器环境。

## 系统要求

- Node.js >= 10.0.0
- 现代浏览器（支持 ES2015+）

## 使用 npm 安装

```bash
npm install jsvm2
```

## 使用 yarn 安装

```bash
yarn add jsvm2
```

## 使用 pnpm 安装

```bash
pnpm add jsvm2
```

## CDN 引入

你也可以通过 CDN 直接在浏览器中使用：

```html
<!-- 引入最新版本 -->
<script src="https://unpkg.com/jsvm2@latest/lib/index.js"></script>

<!-- 引入指定版本 -->
<script src="https://unpkg.com/jsvm2@1.2.5/lib/index.js"></script>
```

## 验证安装

安装完成后，你可以通过以下代码验证是否安装成功：

```javascript
// Node.js 环境
const { run } = require('jsvm2');

// ES6 模块
import { run } from 'jsvm2';

// 测试执行
const result = run('1 + 2 * 3');
console.log(result); // 输出: 7
```

## TypeScript 支持

JSVM2 内置了 TypeScript 类型定义，无需额外安装 @types 包：

```typescript
import { run, createContext, runInContext } from 'jsvm2';

const result: any = run('Math.PI * 2');
console.log(result); // 输出: 6.283185307179586
```

## 下一步

- [基础用法](./basic-usage) - 学习如何使用 JSVM2
- [示例代码](./examples) - 查看更多使用示例