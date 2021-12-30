import { Program, Identifier } from '@babel/types';
import { Path } from '../../path';
import { isVariableDeclaration, isFunctionDeclaration } from '../babelTypes';
import { Kind } from '../../var';
import { Signal } from '../../signal';
/*
"program": {
    "type": "Program",
    "start": 0,
    "end": 259,
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 11,
        "column": 0
      }
    },
    "sourceType": "module",
    "interpreter": null,
    "body": [],
    "directives": []
  },
* */
export function Program(path: Path<Program>) {
  const { node: program, scope } = path;
  // hoisting
  for (const node of program.body) {
    if (isFunctionDeclaration(node)) {
      path.visitor(path.createChild(node));
    } else if (isVariableDeclaration(node)) {
      for (const declaration of node.declarations) {
        if (node.kind === Kind.var) {
          scope.declareVar((declaration.id as Identifier).name, undefined);
        }
      }
    }
  }
  let result;
  for (const node of program.body) {
    if (!isFunctionDeclaration(node)) {
      result = path.visitor(path.createChild(node));
      if (Signal.isReturn(result)) {
        return result;
      }
    }
  }
  return result;
}
