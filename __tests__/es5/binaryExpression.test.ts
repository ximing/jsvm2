import { run } from '../helper';

describe('BinaryExpression spec:', () => {
  it('bitwise shift', () => {
    const res = run(`
    var obj = {a: (2 << 2),b: (2 >> 2),c:(2 >>> 2)};
    module.exports = obj;
    `);
    expect(res).toEqual({ a: 8, b: 0, c: 0 });
  });

  it('relational <,<=,>,>=', () => {
    const res = run(`
    var obj = {a: (1<1),b: (1<=1),c:(1>1),d:(1>=1)};
    var inRes = "a" in obj;
    obj.inRes= inRes;
    var instanceofRes =obj instanceof Object
    obj.instanceofRes= instanceofRes;
    module.exports = obj;
    `);
    expect(res).toEqual({ a: false, b: true, c: false, d: true, inRes: true, instanceofRes: true });
  });

  it('equality ==,!=,===,!==', () => {
    const res = run(`
    var obj = {a: (null==undefined),b: (NaN!=NaN),c:(1===1),d:(1!==1)};
     module.exports = obj;
    `);
    expect(res).toEqual({ a: true, b: true, c: true, d: false });
  });

  it('+,-,*,/,%,|,^,&', () => {
    const res = run(`
    var obj = {a: (1+1),b: (1-1),c:(2*2),d:(2/2),e:(2%2),f:(2|2),g:(2^2),h:(2&2)};
    module.exports = obj;
    `);
    expect(res).toEqual({ a: 2, b: 0, c: 4, d: 1, e: 0, f: 2, g: 0, h: 2 });
  });
});
