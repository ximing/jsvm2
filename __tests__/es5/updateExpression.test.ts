import { run } from '../helper';

describe('UpdateExpression spec:', () => {
  it('++,--', () => {
    const res = run(`
    var num = 1;
    var obj = {a: ++num,b: num++,c:--num,d:num--,num};
    module.exports = obj;
    `);
    expect(res).toEqual({ a: 2, b: 2, c: 2, d: 2, num: 1 });
  });

  it('MemberExpression ++,--', () => {
    const res = run(`
    var o = {n:1};
    var obj = {a: ++o.n,b: o.n++,c:--o.n,d:o.n--,num:o.n};
    module.exports = obj;
    `);
    expect(res).toEqual({ a: 2, b: 2, c: 2, d: 2, num: 1 });
  });
});
