import { run } from '../helper';

describe('this expression spec:', () => {
  it('base', function () {
    expect(
      run(`
      function Human(){
        this.name = "ximing";
      }
      const human = new Human();
      module.exports = human.name;
    `)
    ).toEqual('ximing');
  });
  it('this', function () {
    const res = run(`
      var foo = {
        bar: function () {
          return this;
        }
      };
      module.exports = {
        a:foo.bar(),
        foo:foo
      };
    `);
    expect(res.a).toEqual(res.foo);
  });

  it('obj', function () {
    const res = run(`
      function a(){ return this;};
      var foo = {
        bar: function () {
          return a();
        }
      };
      module.exports = {
        a:foo.bar(),
        foo:foo
      };
    `);
    expect(res.a).toEqual(undefined);
  });

  it('function', function () {
    const res = run(`
      function a(){ 
        var b = function(){
          return this;
        }
        return b();
      }
      module.exports = a()
    `);
    expect(res).toEqual(undefined);
  });

  it('function', function () {
    const res = run(`
      function b(){ return this}
      function a(){
        return b();
      }
      module.exports = a()
    `);
    expect(res).toEqual(undefined);
  });

  it('function in object', function () {
    const res = run(`
      function foo () {
        return this.a
      }
      var obj = { a: 1, foo }
      module.exports = obj.foo();
    `);
    expect(res).toEqual(1);
  });

  it('params', function () {
    const res = run(`
      function foo () {
        return this;
      }
      function doFoo (fn) {
        return fn()
      }
      var obj = { a: 1, foo }
      module.exports = doFoo(obj.foo);
    `);
    expect(res).toEqual(undefined);
  });

  it('params', function () {
    const res = run(`
      function foo () {
        return this;
      }
      function doFoo (fn) {
        return fn()
      }
      var obj = { a: 1, foo }
      var obj2 = { a: 2, doFoo }
      module.exports = obj2.doFoo(obj.foo);
    `);
    expect(res).toEqual(undefined);
  });

  it('bind', function () {
    const res = run(`
      function foo () {
        return this.a
      }
      var foo1 = foo.bind({a:2})
      module.exports = foo1();
    `);
    expect(res).toEqual(2);
  });

  it('apply', function () {
    const res = run(`
      function foo () {
        return this.a
      }
      module.exports = foo.apply({a:3},[]);
    `);
    expect(res).toEqual(3);
  });

  it('call', function () {
    const res = run(`
      function foo () {
        return this.a
      }
      module.exports = foo.call({a:4},0);
    `);
    expect(res).toEqual(4);
  });

  it('object', function () {
    const res = run(`
      var temp = null;
      var A = function () {
        function A() {
          this.e = 'e';
          temp = this.d()
        }
      
        var _proto = A.prototype;
      
        _proto.b = function b() {
          var _this = this;
      
          var fn = function fn() {
            return _this;
          };
      
          return fn();
        };
      
        _proto.c = function c() {
          return this;
        };
        
        _proto.d = function c() {
          return this.e;
        };
      
        return A;
      }();
      const obj = new A();
      module.exports = {
        b: obj.b(),
        c: obj.c(),
        A: A,
        obj: obj,
        temp: temp
      };
    `);
    expect(res.b).toEqual(res.obj);
    expect(res.c).toEqual(res.obj);
    expect(res.temp).toEqual('e');
    expect(res.b instanceof res.A).toEqual(true);
  });

  it('this case1', function () {
    const res = run(`
      var foo = {
        fn: function(){
          function n(){
            return this;
          }
          return n();
        }
      }
      module.exports = foo.fn();
    `);
    expect(res).toEqual(undefined);
  });

  it('this case2', function () {
    const res = run(`
      const foo = {
        fn: function(){
          const self = this;
          function n(){
            return self;
          }
          return n();
        }
      }
      module.exports = foo.fn() === foo;
    `);
    expect(res).toEqual(true);
  });

  it('this case3', function () {
    const res = run(`
      function n(){
          return this;
      }
      var foo = {
        fn: function(){
          return n();
        }
      }
      module.exports = foo.fn();
    `);
    expect(res).toEqual(undefined);
  });

  it('this expression', () => {
    const func = run(
      `
function t(){
  this.name = "hello";
  return this;
}
 module.exports = t;
  `
    );
    const ctx: { [x: string]: any } = {};
    func.call(ctx);
    expect(ctx.name).toEqual('hello');
  });
});
