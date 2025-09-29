# JSVM2 文档

这是 JSVM2 项目的文档站点，使用 [Docusaurus](https://docusaurus.io/) 构建。

## 本地开发

### 安装依赖

```bash
cd docs
npm install
```

### 启动开发服务器

```bash
npm start
```

这个命令会启动本地开发服务器并打开浏览器窗口。大多数更改会实时反映，无需重启服务器。

### 构建

```bash
npm run build
```

这个命令会生成静态文件到 `build` 目录，可以部署到任何静态文件托管服务。

## 部署

文档会通过 GitHub Actions 自动部署到 GitHub Pages。当向 `master` 分支推送包含 `docs/` 目录更改的提交时，会自动触发部署流程。

## 目录结构

```
docs/
├── docs/                 # 文档内容
│   ├── intro.md          # 介绍页面
│   ├── getting-started/  # 快速开始
│   ├── api/             # API 参考
│   ├── language-support/ # 语言支持
│   └── development/      # 开发指南
├── blog/                # 博客文章
├── src/                 # React 组件和页面
├── static/              # 静态资源
├── docusaurus.config.ts # Docusaurus 配置
└── sidebars.ts          # 侧边栏配置
```

## 编写文档

### 添加新文档

1. 在 `docs/` 目录下创建新的 Markdown 文件
2. 在文件顶部添加 front matter：

```markdown
---
sidebar_position: 1
title: 页面标题
---

# 页面标题

内容...
```

3. 更新 `sidebars.ts` 文件以包含新页面

### 文档规范

- 使用中文编写所有文档内容
- 代码示例使用中文注释
- 保持文档结构清晰，使用适当的标题层级
- 为代码示例提供完整的上下文

## 贡献

欢迎为文档贡献内容！请确保：

1. 文档内容准确且最新
2. 代码示例可以正常运行
3. 遵循现有的文档风格和结构
4. 提交前在本地测试文档构建