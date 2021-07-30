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
});
