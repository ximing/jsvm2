# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

JSVM2 is a JavaScript interpreter implemented in JavaScript, designed to execute JavaScript code in a sandboxed environment. It implements ECMAScript 5 features with partial ES2015+ support and follows the ECMAScript specification (https://www.ecma-international.org/wp-content/uploads/ECMA-262_5th_edition_december_2009.pdf).

## Development Commands

### Building
```bash
npm run build        # Build the project using Rollup
```

### Testing
```bash
npm test            # Run all tests with Jest
npm run test:coverage   # Run tests with coverage report
npm run test:debug      # Run tests in debug mode with inspector
```

### Code Quality
```bash
npm run typecheck   # Type check with TypeScript (use this to verify changes)
```

Note: There are no lint commands defined in package.json. Always run `npm run typecheck` after making changes to ensure TypeScript compliance.

## Architecture Overview

### Core Components

- **VM (`src/vm.ts`)**: Main entry point providing `run()`, `runInContext()`, and `createContext()` functions
- **Visitor Pattern (`src/visitor.ts`)**: Central dispatcher that routes AST nodes to appropriate handlers
- **Context (`src/context.ts`)**: Sandboxed execution environment with global objects (ECMAScript standard globals)
- **Scope (`src/scope.ts`)**: Variable scope management system
- **Path (`src/path.ts`)**: AST node wrapper providing traversal context
- **Stack (`src/stack.ts`)**: Call stack management for debugging and error handling

### Language Support Structure

- **`src/standard/es5/`**: Implementation of ECMAScript 5 features (expressions, statements, declarations)
- **`src/standard/es2015/`**: Implementation of ES2015+ features (arrow functions, let/const, destructuring)
- **`src/standard/index.ts`**: Combines all language feature implementations into a single visitor map

### Key Execution Flow

1. Code is parsed into AST using Babel parser
2. AST is wrapped in Path objects
3. Visitor pattern dispatches each node type to its implementation
4. Scope chain manages variable bindings
5. Context provides sandboxed global environment

### Test Structure

- **`__tests__/helper.ts`**: Core testing utilities with `run()` and `runExp()` functions
- Tests use Babel to transform modern JavaScript to ES5 when needed
- Supports optional code hoisting and minification for testing edge cases

## Implementation Guidelines

- The engine operates in strict mode
- All AST node types must have corresponding implementations in `src/standard/`
- New language features should be added to appropriate ES version directories
- Context isolation is critical - avoid exposing host environment globals
- Follow the existing visitor pattern for consistency

## 语言规范

- 所有对话和文档都使用中文，代码中注释也使用中文
- 文档使用 markdown 格式
