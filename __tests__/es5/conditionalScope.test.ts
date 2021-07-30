import { run } from '../helper';
// import { ErrDuplicateDeclare } from '../../src/error';

describe('if scope spec:', () => {
  it('var', function () {
    expect(
      run(`
    var a = 1;
    if (true){
      var a = 2;
    }
    module.exports = a;`)
    ).toEqual(2);
  });

  it('let / const', function () {
    expect(
      run(`
    let a = 1;
    var b;
    var c = 1;
    if (true){
      let a = 2;
      b = 2;
      const c = 2;
    }
    module.exports = {a,b,c};`)
    ).toEqual({ a: 1, b: 2, c: 1 });
  });
});
