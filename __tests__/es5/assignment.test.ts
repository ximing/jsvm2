import { run } from '../helper';
import { ErrNotDefined } from '../../src/error';

describe('assignment spec:', () => {
  it('base', () => {
    expect(
      run(`
      var a = 1;
      module.exports = a;
    `)
    ).toEqual(1);
  });

  it('base logicalExpression', () => {
    expect(
      run(`
      var a = 0 || 1;
      var b = 0 && 1;
      module.exports = {a,b};
    `)
    ).toEqual({ a: 1, b: 0 });
  });

  it('base global', () => {
    expect(
      run(`
      a = 1;
      module.exports = a;
    `)
    ).toEqual(1);
  });

  it('not defined', () => {
    expect(() =>
      run(
        `
const a = 123;
a = b
      `
      )
    ).toThrowError(ErrNotDefined('b').message);
  });

  it('assignment = += -= *= /= %= <<= >>= >>>= &= ^= |=', () => {
    const res = run(`
    var a = 0,b = 0,c = 1,d = 2,e = 2,f = 2,g = 2,h = 2,i = 2,j = 2,k = 2,l = 2;
    a +=1;
    b -=1;
    c *=2;
    d /=2;
    e %=2;
    f <<= 2;
    g >>= 2;
    h >>>= 2;
    i &= 2;
    j ^= 2;
    k |= 2;
    l **= 2;
    var obj = {a,b,c,d,e,f,g,h,i,j,k,l};
    module.exports = obj;
    `);
    expect(res).toEqual({
      a: 1,
      b: -1,
      c: 2,
      d: 1,
      e: 0,
      f: 8,
      g: 0,
      h: 0,
      i: 2,
      j: 0,
      k: 2,
      l: 4,
    });
  });
});
