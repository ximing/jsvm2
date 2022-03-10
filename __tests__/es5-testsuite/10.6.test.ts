import { run } from '../helper';

describe('10.6', function () {
  it('10.6-5-1', () => {
    const a = run(
      `
function testcase() {
  if(Object.getPrototypeOf(arguments) === Object.getPrototypeOf({}))
    return true;
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('10.6-10-c-ii-1-s', () => {
    const a = run(
      `
function foo(a,b,c) {
    'use strict';
    a = 1; b = 'str'; c = 2.1;
    if(arguments[0] === 10 && arguments[1] === 'sss' && arguments[2] === 1)
      return true;   
}
module.exports = foo(10,'sss',1);
    `
    );

    expect(a).toBeTruthy();
  });

  it('10.6-10-c-ii-2-s', () => {
    const a = run(
      `
function foo(a,b,c){
    'use strict';    
    arguments[0] = 1; arguments[1] = 'str'; arguments[2] = 2.1;
    if(10 === a && 'sss' === b && 1 === c)
      return true;   
  }
module.exports = foo(10,'sss',1);
    `
    );

    expect(a).toBeTruthy();
  });
});
