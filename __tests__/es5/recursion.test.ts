import { run } from '../helper';

describe('prototype spec:', () => {
  it('constructor function', () => {
    const res = run(`
    let a = 1;
    function fn(f){
      return f();
    }
    fn(function fn1(){
      if(a>3){return}
      else {a++}
      fn1();
    })
    module.exports = a;
    `);
    expect(res).toEqual(4);
  });
});
