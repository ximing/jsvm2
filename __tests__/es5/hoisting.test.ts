import { run } from '../helper';

describe('hoisting spec:', () => {
  // https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting
  it('function', function () {
    const res = run(`
      var a = catName("Chloe");

      function catName(name) {
          return name;
      }
      module.exports = a;
    `);
    expect(res).toEqual('Chloe');
  });

  it('var', function () {
    const res = run(`
      num = 6;
      var num;
      module.exports = num;
    `);
    expect(res).toEqual(6);
  });
});
