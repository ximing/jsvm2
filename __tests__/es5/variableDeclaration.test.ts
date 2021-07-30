import { run } from '../helper';

describe('variable spec:', () => {
  it('var', function () {
    expect(
      run(`
      var a = 1;
      module.exports = a;
    `)
    ).toEqual(1);
  });

  it('duplicate var', function () {
    expect(
      run(`
      var a = 1;
      var a = 2;
      module.exports = a;
    `)
    ).toEqual(2);
  });

  it('context var', function () {
    expect(
      run(
        `
    var global = 1;
    module.exports = global;
    `,
        {
          global: 2,
        }
      )
    ).toEqual(2);
  });

  it('context replace var', function () {
    expect(
      run(
        `
       function fn(){
          let global = 1;
          return global;
       }
       module.exports = fn();
    `,
        {
          global: 2,
        }
      )
    ).toEqual(1);
  });

  it('context replace var 2', function () {
    expect(
      run(
        `
       function fn(){
          let global = 1;
          return global;
       }
       module.exports = fn;
    `,
        {
          global: 2,
        }
      )()
    ).toEqual(1);
  });
  it('global var', function () {
    expect(
      run(
        `
       module.exports = {global};
    `,
        {
          global: 2,
        }
      )
    ).toEqual({
      global: 2,
    });
  });

  // https://segmentfault.com/a/1190000008475665
  it('continuous define continuous assignment', function () {
    const res = run(
      `
        var a = {n: 1};
        var b = a;
        a.x = a = {n: 2};
        module.exports = {a, b};
    `
    );
    expect(res.a.n).toEqual(2);
    expect(res.a.hasOwnProperty('x')).toBeFalsy();
    expect(res.b.n).toEqual(1);
    expect(res.b.hasOwnProperty('x')).toBeTruthy();
    expect(res.b.x.n).toEqual(2);
  });

  it('complex', function () {
    const res = run(`
      let v = 'v';
      let o = { [v]: 1, f(){} };
      let f = () => o;
      module.exports = {v,o,f}
    `);
    expect(res.v).toEqual('v');
    expect(res.o.v).toEqual(1);
    expect(typeof res.o.f).toEqual('function');
    expect(res.o.f()).toEqual(undefined);
  });
});
