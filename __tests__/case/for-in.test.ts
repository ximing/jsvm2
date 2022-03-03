import { run } from '../helper';

describe('for in', () => {
  it('hasOwnProperty', function () {
    const res = run(`
      const obj = {
        a: false,
        1: 0
      };
      for (let attr in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, attr)) {
          obj[attr] = !obj[attr];
        }
      }
      module.exports = obj;
  `);
    expect(res).toEqual({ a: true, 1: true });
  });
});
