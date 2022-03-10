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
    expect(obj.sub.name).toEqual('sub');
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
          return params
        }
        module.exports = a(params);
    `);
    expect(res.b).toEqual(2);
  });

  it('function return undefined', function () {
    const res = run(`
        const params = {a:1};
        function a(params) {
          params = {b:2}
        }
        module.exports = a(params);
    `);
    expect(res).toEqual(undefined);
  });

  it('string prototype', function () {
    const res = run(`
        module.exports = "".concat(1,2,3);
    `);
    expect(res).toEqual('123');
  });

  it('function arguments reset without use strict', () => {
    const a = run(
      `
        function test(a,b,c){
           // 'use strict' is 1 , otherwise 2
            a=2;
            return [arguments[0],arguments[1],arguments[2]];
        }
        module.exports = test(1,2,3);
    `
    );

    expect(a).toEqual([1, 2, 3]);
  });

  it('function .call case1', () => {
    const a = run(
      `
        function test(){
            return  this;
        }
        var da = {
            o: true,
            func: test,
        };
        module.exports = (0, da.func)();
    `,
      {}
    );
    expect(a).toEqual(undefined);
  });

  it('function .call case2', () => {
    const a = run(
      `
        function test(){
            return  this.o;
        }
        var da = {
            o: true,
            func: test,
        }
        module.exports = da.func();
    `,
      {}
    );
    expect(a).toEqual(true);
  });

  it('function .call case3', () => {
    const a = run(
      `
        function test(){
            return  this;
        }
        module.exports = test.bind(100)();
    `,
      {}
    );
    expect(a).toEqual(100);
  });

  it('function .call case4', () => {
    const a = run(
      `
        function test(){
            return  this;
        }
        module.exports = test.call(100);
    `,
      {}
    );
    expect(a).toEqual(100);
  });

  it('object function scope case1', () => {
    const a = run(
      `
var dx = {
    fy: function fy1() {
        return typeof fy1
    }
};
module.exports = [typeof fy1, dx.fy, dx.fy()]
    `
    );

    expect(a[0]).toEqual('undefined');
    expect(a[1].name).toEqual('fy1');
    expect(a[2]).toEqual('function');
  });

  it('object function scope case2', () => {
    const a = run(
      `
var d = {
    fy: function() {
        return typeof fy
    }
};
module.exports = [d.fy.name, d.fy()]
    `
    );

    expect(a).toEqual(['fy', 'undefined']);
  });

  it('object function scope case3', () => {
    const a = run(
      `
var d = {
    fy() {
        return typeof fy
    }
};
module.exports = [d.fy.name, d.fy()]
    `
    );

    expect(a[0]).toEqual('fy');
    expect(a[1]).toEqual('undefined');
  });

  it('function name scope case1', () => {
    const a = run(
      `
var tuh = 1;
var t1 = function(){ return typeof t1 };
tuh = function(){ return typeof tuh };
module.exports = [t1.name,t1(), tuh()]
    `
    );

    expect(a).toEqual(['t1', 'function', 'function']);
  });

  // 严格模式下应该报错的 TypeError: Assignment to constant variable. 要考虑下怎么实现
  //   it('function name scope case2', () => {
  //     const a = run(
  //       `
  // var u = 1
  // var x = function u() { u = 2; return u };
  // module.exports = [u, x(), x]
  //     `
  //     );
  //
  //     expect(a).toEqual([1, a.x]);
  //   });

  it('function call non context', () => {
    const a = run(
      `
        function call_1(){
            return typeof this;
        }
        module.exports = call_1();
    `
    );
    expect(a).toEqual('undefined');
  });

  it('function call context', () => {
    const a = run(
      `
        function call_1(){
            return typeof this;
        }
        module.exports = call_1.apply(true);
    `
    );
    expect(a).toEqual('boolean');
  });
});
