import { File } from '@babel/types';

import { Path } from '../../path';
import { Program } from './program';
import { Identifier } from './identifier';
import {
  BooleanLiteral,
  NullLiteral,
  NumericLiteral,
  RegExpLiteral,
  StringLiteral,
} from './literal';
import { VariableDeclaration, VariableDeclarator } from './variable';
import { BinaryExpression } from './binaryExpression';
import { ObjectExpression, ObjectMethod, ObjectProperty } from './object';
import { AssignmentExpression } from './assignmentExpression';
import { CallExpression } from './callExpression';
import { MemberExpression } from './memberExpression';
import { FunctionDeclaration, FunctionExpression } from './function';
import {
  BlockStatement,
  DebuggerStatement,
  EmptyStatement,
  ExpressionStatement,
  LabeledStatement,
} from './statement';
import { CatchClause, ThrowStatement, TryStatement } from './tryCatch';
import { DoWhileStatement, ForInStatement, ForStatement, WhileStatement } from './loopStatement';
import { ConditionalExpression, IfStatement, SwitchCase, SwitchStatement } from './conditional';
import { ReturnStatement, BreakStatement, ContinueStatement } from './signalStatement';
import { SequenceExpression } from './sequenceExpression';
import { NewExpression } from './newExpression';
import { ThisExpression } from './thisExpression';
import { UnaryExpression } from './unaryExpression';
import { LogicalExpression } from './logicalExpression';
import { UpdateExpression } from './updateExpression';
import { ArrayExpression } from './arrayExpression';

export default {
  File(path: Path<File>) {
    path.visitor(path.createChild(path.node.program));
  },
  Program,
  Identifier,
  RegExpLiteral,
  StringLiteral,
  NumericLiteral,
  BooleanLiteral,
  NullLiteral,
  VariableDeclaration,
  VariableDeclarator,
  ArrayExpression,
  BinaryExpression,
  ObjectExpression,
  ObjectProperty,
  ObjectMethod,
  AssignmentExpression,
  CallExpression,
  MemberExpression,
  FunctionExpression,
  FunctionDeclaration,
  EmptyStatement,
  BlockStatement,
  ExpressionStatement,
  DebuggerStatement,
  LabeledStatement,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
  SwitchStatement,
  SwitchCase,
  IfStatement,
  ConditionalExpression,
  ForStatement,
  DoWhileStatement,
  WhileStatement,
  ForInStatement,
  ThrowStatement,
  CatchClause,
  TryStatement,
  NewExpression,
  ThisExpression,
  SequenceExpression,
  UnaryExpression,
  UpdateExpression,
  LogicalExpression,
};
