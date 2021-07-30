import * as t from '@babel/types';
import { UNDEFINED } from '../../constants';
import { ErrNotDefined } from '../../error';
import { overrideStack } from '../utils';
import { Path } from '../../path';

/*
var a = undefined;
[
      {
        "type": "VariableDeclaration",
        "start": 0,
        "end": 18,
        "loc": {
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 18
          }
        },
        "declarations": [
          {
            "type": "VariableDeclarator",
            "start": 4,
            "end": 17,
            "loc": {
              "start": {
                "line": 1,
                "column": 4
              },
              "end": {
                "line": 1,
                "column": 17
              }
            },
            "id": {
              "type": "Identifier",
              "start": 4,
              "end": 5,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 4
                },
                "end": {
                  "line": 1,
                  "column": 5
                },
                "identifierName": "a"
              },
              "name": "a"
            },
            "init": {
              "type": "Identifier",
              "start": 8,
              "end": 17,
              "loc": {
                "start": {
                  "line": 1,
                  "column": 8
                },
                "end": {
                  "line": 1,
                  "column": 17
                },
                "identifierName": "undefined"
              },
              "name": "undefined"
            }
          }
        ],
        "kind": "var"
      }
    ]
* */
export function Identifier(path: Path<t.Identifier>) {
  const { node, scope, stack } = path;
  if (node.name === UNDEFINED) {
    return undefined;
  }
  const $var = scope.hasBinding(node.name);
  if ($var) {
    return $var.value;
  } else {
    throw overrideStack(ErrNotDefined(node.name), stack, node);
  }
}
