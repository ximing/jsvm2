import { ANONYMOUS } from '../constants';
import { Stack } from '../stack';
import { Node } from '../types';

export function overrideStack(err: Error, stack: Stack, node: Node): Error {
  stack.push({
    filename: ANONYMOUS,
    stack: stack.currentStackName,
    location: node.loc,
  });
  err.stack = err.toString() + '\n' + stack.raw;
  return err;
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function defineFunction(func, node, name?) {
  Object.defineProperties(func, {
    name: {
      value: name || (node.id ? node.id.name : ''),
      writable: false,
      enumerable: false,
      configurable: true,
    },
    length: { value: node.params.length, writable: false, enumerable: false, configurable: true },
  });
}

export class Prototype {
  // @ts-ignore
  constructor(public constructor) {}
}

export class This {
  constructor(public context) {}
}

export const functionThis = new WeakMap();

export const runtimeThis = new WeakMap();
