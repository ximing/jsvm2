import { run } from '../helper';

describe('warp', () => {
  it('define', function () {
    const exports: any = {};
    const res = run(
      `
      var e = {};
      define('a',function(exports,require){
        var PopCreater = {
          createRender(){
            return [].slice.call(arguments);
          }
        }
        exports.PopCreater = PopCreater;
        exports.res1 = PopCreater.createRender({s:3});
        e = exports;
      })
      module.exports = e.PopCreater.createRender({ s: 2 });
  `,
      {
        define(id, callback) {
          callback(exports, function require() {});
        },
        exports,
      }
    );
    expect(exports.PopCreater.createRender({ s: 1 })).toEqual([{ s: 1 }]);
    expect(res).toEqual([{ s: 2 }]);
    expect(exports.res1).toEqual([{ s: 3 }]);
  });
});
