![build workflow](https://github.com/ximing/jsvm2/actions/workflows/build.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ximing/jsvm2/badge.svg?branch=master)](https://coveralls.io/github/ximing/jsvm2?branch=master)

## Specification

https://tc39.es/ecma262

## 支持能力

### ES5

- [x] File
- [x] Program
- [x] Identifier
- [x] NullLiteral
- [x] StringLiteral
- [x] NumericLiteral
- [x] BooleanLiteral
- [x] RegExpLiteral
- [x] VariableDeclaration
- [x] FunctionDeclaration
- [x] FunctionExpression
- [x] ArrayExpression
- [x] VariableDeclarator
- [x] ExpressionStatement
- [x] BlockStatement
- [x] ConditionalExpression
- [x] EmptyStatement
- [x] DebuggerStatement
- [ ] WithStatement: t.WithStatement; // 不实现，@babel/parse 在严格模式下禁用 WithStatement
- [x] ReturnStatement
- [x] LabeledStatement
- [x] BreakStatement
- [x] ContinueStatement
- [x] IfStatement
- [x] SwitchStatement
- [x] SwitchCase
- [x] ThrowStatement
- [x] TryStatement
- [x] CatchClause
- [x] ForStatement
- [x] WhileStatement
- [x] DoWhileStatement
- [x] ForInStatement
- [x] ThisExpression
- [x] ObjectExpression
- [x] ObjectProperty
- [x] ObjectMethod
- [x] UnaryExpression
- [x] UpdateExpression
- [x] BinaryExpression
- [x] AssignmentExpression
- [x] LogicalExpression
- [x] MemberExpression
- [x] CallExpression
- [x] NewExpression
- [x] SequenceExpression

### ES2015

- [x] VariableDeclaration (let/const)
- [x] ArrowFunctionExpression
- [ ] TemplateLiteral
- [ ] TaggedTemplateExpression
- [x] ForOfStatement
- [ ] ClassDeclaration
- [ ] ClassExpression
- [ ] ClassBody
- [ ] ClassMethod
- [x] MetaProperty
- [ ] Super
- [ ] TemplateElement
- [x] SpreadElement
- [ ] YieldExpression
- [x] ObjectPattern
- [ ] ArrayPattern
- [ ] RestElement
- [ ] AssignmentPattern
- [ ] ImportDeclaration
- [ ] ExportNamedDeclaration
- [ ] ExportDefaultDeclaration

### ES2016

- [x] BinaryExpression

### ES2017

- [ ] AwaitExpression

### Experimental

- [ ] ImportSpecifier
- [ ] ImportDefaultSpecifier
- [ ] ExportSpecifier
- [ ] SpreadProperty
- [ ] DoExpression
- [ ]Decorator

## Test

- [ECMAScript Test262](http://test262.ecmascript.org/)
- JS 面试题
- 高程内 CASE
