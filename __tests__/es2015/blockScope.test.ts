import { run } from '../helper';

describe('block scope spec:', () => {
  it("var don't have block scope", () => {
    const obj = run(
      `
        var a = 123;
        var b;
        {
          var b = 321;
        }
        module.exports = {a:a, b:b};
  `
    );
    expect(obj).toEqual({ a: 123, b: 321 });
  });

  it('let have block scope', () => {
    const obj = run(
      `
        var a = 123;
        var b;
        {
          let b = 321;
        }
        module.exports = {a:a,b:b};
  `
    );
    expect(obj).toEqual({ a: 123, b: undefined });
  });

  it('let have block scope in the function', () => {
    const fn = run(
      `
        function fn(){
          var a = 123;
          var b;
          {
            let a = 321;
            b = a;
          }
          return {a: a, b: b};
        }
        module.exports = fn;
  `
    );
    expect(fn()).toEqual({ a: 123, b: 321 });
  });
});
