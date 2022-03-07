import { run } from './helper';

describe('dev', function () {
  it('this case1', function () {
    const res = run(`
      var foo = {
        fn: function(){
          function nnn(){
            return this;
          }
          return nnn();
        }
      }
      module.exports = foo.fn();
    `);
    expect(res).toEqual(undefined);
  });
});
