import { ErrIsNotFunction } from '../../src/error';
import { run } from '../helper';

describe('function spec:', () => {
  it('base Expression', () => {
    const fn = run(`
      function fn(a,b){
        return a+b;
      }
      module.exports = fn;
    `);
    expect(typeof fn).toEqual('function');
    expect(fn(1, 2)).toEqual(3);
    expect(fn.length).toEqual(2);
    expect(fn.name).toEqual('fn');
    // TODO
    // expect(fn.toString()).toEqual(`function fn(a,b){
    //     return a+b;
    //   }`);
  });

  it('base Declaration', () => {
    const fn = run(`
      const func = function fn(a,b){
        return a+b;
      }
      module.exports = func;
    `);
    expect(typeof fn).toEqual('function');
    expect(fn(1, 2)).toEqual(3);
    expect(fn.length).toEqual(2);
    expect(fn.name).toEqual('fn');
    // TODO
    // expect(fn.toString()).toEqual(`function fn(a,b){
    //     return a+b;
    //   }`);
  });

  it('object function', () => {
    const obj = run(`
      const obj = {
        sum(a,b){
          return a+b;
        },
        sub:function(a,b){
          return a-b;
        }
      }
      module.exports = obj;
    `);
    expect(typeof obj.sum).toEqual('function');
    expect(typeof obj.sub).toEqual('function');
    expect(obj.sum(1, 2)).toEqual(3);
    expect(obj.sub(1, 2)).toEqual(-1);
    expect(obj.sum.length).toEqual(2);
    expect(obj.sub.length).toEqual(2);
    expect(obj.sum.name).toEqual('sum');
    expect(obj.sub.name).toEqual('');
  });

  it('assignmentPattern function', function () {
    expect(
      run(`
      function fn (name = 'ximing'){ return name;}
      module.exports = fn();
    `)
    ).toEqual('ximing');
  });

  it('assignmentPattern function call', function () {
    expect(
      run(`
      function fn (name = 'ximing'){ return name;}
      module.exports = fn;
    `)()
    ).toEqual('ximing');
  });

  it('invalid function call', function () {
    expect(() =>
      run(`
      const a = 1;
      module.exports = a();
    `)
    ).toThrow(ErrIsNotFunction('a').message);
  });

  it('object-property function call name', function () {
    expect(() =>
      run(`
      const obj = {
        a:1
      };
      module.exports = obj.a();
    `)
    ).toThrow(ErrIsNotFunction('obj.a').message);
  });

  it('object-property function call name computed', function () {
    expect(() =>
      run(`
      const obj = {
        a:1
      };
      module.exports = obj['a']();
    `)
    ).toThrow(ErrIsNotFunction('obj["a"]').message);
  });

  it('function params should can be overwrite', function () {
    expect(
      run(`
    var a = 1;
    function fn(a) {
      a = a + 1;
      return a;
    }
    module.exports = {res:fn(a),a};
    `)
    ).toEqual({ res: 2, a: 1 });
  });

  it('function params should can be overwrite object reference', function () {
    expect(
      run(`
    let a = { b:1 };
    function fn(a) {
      a.b += 1;
      return a;
    }
    fn(a);
    module.exports = a;
    `)
    ).toEqual({ b: 2 });
  });

  it('function name cover', function () {
    const res = run(`
        var xCover, cover;
        xCover = (0, function() {});
        cover = (function() {});
        module.exports = {xCover,cover};
    `);
    expect(res.xCover.name).not.toEqual('xCover');
    // TODO
    // expect(res.cover.name).toEqual('cover');
  });

  it('function params cover', function () {
    const res = run(`
        const params = {a:1};
        function a(params) {
          params = {b:2}
        }
        module.exports = a(params);
    `);
    expect(res.b).toEqual(2);
  });
});
