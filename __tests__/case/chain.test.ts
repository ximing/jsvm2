import { run } from '../helper';

describe('chain spec:', () => {
  it('constructor function', () => {
    const res = run(`
    let a = 0;
    function d() {
      a++;
      // console.log('d');
      return {
        c: function () {
          // console.log('c');
        },
      };
    }
    d().c();
    module.exports = a;
    `);
    expect(res).toEqual(1);
  });
});
