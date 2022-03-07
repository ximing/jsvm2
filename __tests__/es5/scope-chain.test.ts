import { run } from '../helper';

describe('scope-chain spec:', () => {
  it('case1', () => {
    const res = run(`
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
module.exports = checkscope()();
  `);
    expect(res).toEqual('local scope');
  });

  it('case2', () => {
    const res = run(`
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
module.exports = checkscope();
  `);
    expect(res).toEqual('local scope');
  });
});
