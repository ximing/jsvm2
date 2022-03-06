import { NodePath } from '@babel/core';
import * as t from '@babel/types';

const hoistVariables = require('@babel/helper-hoist-variables').default;

function hasStrictModeDirective(path: any) {
  const { directives } = path.isProgram() ? path.node : path.node.body;
  return directives.some(
    (d: any) => d.value && d.value.type === 'DirectiveLiteral' && d.value.value === 'use strict'
  );
}

function isStrictMode(path: any) {
  while (path) {
    if (hasStrictModeDirective(path)) {
      return true;
    }
    path = path.getFunctionParent();
  }
  return false;
}

function isHoisted(path: any, parentFn: any) {
  return path.scope.parent === parentFn.scope;
}

module.exports = () => {
  return {
    visitor: {
      VariableDeclaration: {
        exit(path: NodePath<t.VariableDeclaration>) {
          if (path.node.kind === 'var') {
            const targetScope = path.scope.getFunctionParent() || path.scope.getProgramParent();
            if (path.scope === targetScope) return;
            hoistVariables(
              path.parentPath,
              (id: any) => {
                /*
                 * var a = i;
                 * for (var i = 0; i <0;i++){}
                 * 这种case下 直接通过 targetScope.hasOwnBinding 判断 i 是属于Program的作用域的，所以要判断一下i本身的位置
                 * 如果不在目标作用域的情况下，还是要提升一下变量的声明
                 * */
                if (
                  (targetScope.hasOwnBinding(id.name) && path.parentPath !== targetScope.path) ||
                  !targetScope.hasOwnBinding(id.name)
                ) {
                  targetScope.push({ id: t.cloneNode(id) });
                }
              },
              'var'
            );
            path.skip();
          }
        },
      },
      FunctionDeclaration: {
        exit(path: any, { file }: any) {
          let targetPath = path.getFunctionParent();
          if (!targetPath) {
            targetPath = path.scope.getProgramParent().path;
          } else if (isStrictMode(targetPath) || isHoisted(path, targetPath)) {
            return;
          }
          if (targetPath.isProgram()) {
            const node = t.cloneNode(path.node);
            file.get('__FunctionDeclaration__').push(node);
          } else {
            targetPath.get('body').unshiftContainer('body', t.cloneNode(path.node));
          }
          path.remove();
        },
      },
      Program: {
        enter(path: any, { file }: any) {
          file.set('__FunctionDeclaration__', []);
        },
        exit(path: NodePath<t.Program>, { file }: any) {
          file.get('__FunctionDeclaration__').forEach((node: t.Statement) => {
            path.node.body.unshift(node);
          });
        },
      },
    },
  };
};
