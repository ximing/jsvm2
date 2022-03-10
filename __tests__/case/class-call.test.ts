import { run } from '../helper';

describe('warp', () => {
  it('define', function () {
    const res = run(
      `
      let count = {
        c1 : 0,
        c2 : 0
      };
      class A{
        async f1(){
          count.c1++;
          await Promise.resolve(1)
          return 1;
        }
        f2(){
          count.c2++;
          return this.f1();
        }
      }
      const a = new A();
      a.f2();
      module.exports = {count}
  `,
      { regeneratorRuntime: require('regenerator-runtime/runtime.js') },
      true,
      true
    );
    expect(res.count).toEqual({ c1: 1, c2: 1 });
  });
});
