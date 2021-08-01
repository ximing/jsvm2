import { Stack } from '../src/stack';
import { ANONYMOUS } from '../src/constants';

describe('stack', function () {
  it('method', function () {
    const stack = new Stack(10);
    stack.enter(`fnName`);
    const pen = {
      filename: ANONYMOUS,
      stack: stack.currentStackName,
      location: {
        start: {
          line: 0,
          column: 0,
        },
        end: {
          line: 0,
          column: 0,
        },
      },
    };
    const pen1 = {
      filename: ANONYMOUS,
      stack: stack.currentStackName,
      location: null
    }
    stack.push(pen);
    expect(stack.peek()).toEqual(pen);
    expect(stack.raw).toEqual(`    at fnName (<anonymous>:0:1)`);
    expect(stack.size).toEqual(1);
    stack.leave();
    expect(stack.size).toEqual(0);
    expect(stack.isEmpty()).toBeTruthy();
    stack.push(pen1);
    expect(stack.raw).toEqual(`    at fnName (<anonymous>:0:0)`);
    stack.push(pen);
    stack.push(pen);
    stack.clear();
    expect(stack.isEmpty()).toBeTruthy();
    for (let i = 0; i < 16; i++) {
      stack.push(pen);
    }
    expect(stack.size).toEqual(10);
  });
});
