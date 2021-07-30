import { run } from '../helper';

describe('UnaryExpression spec:', () => {
  it('delete', () => {
    const res = run(`
    var obj = {a:1,b:null}
    delete obj["a"];
    delete obj.b;
    module.exports = obj;
    `);
    expect(res).toEqual({});
  });

  it('typeof', () => {
    const res = run(`
    module.exports = typeof 1;
    `);
    expect(res).toEqual('number');
  });

  it('typeof undefined', () => {
    const res = run(`
    module.exports = typeof a;
    `);
    expect(res).toEqual('undefined');
  });

  it('void 0', () => {
    const res = run(`
    module.exports = void 0;
    `);
    expect(res).toEqual(undefined);
  });

  it('+,-,~', () => {
    const res = run(`
    var obj = {a: +("1"),b: -("1"),c:~("1")}
    module.exports = obj;
    `);
    expect(res.a).toEqual(1);
    expect(res.b).toEqual(-1);
    expect(res.c).toEqual(-2);
  });

  it('!', () => {
    const res = run(`
    var obj = {a: !1,b:!null,c:!0,d:!false}
    module.exports = obj;
    `);
    expect(res.a).toBeFalsy();
    expect(res.b).toBeTruthy();
    expect(res.c).toBeTruthy();
    expect(res.d).toBeTruthy();
  });
});
