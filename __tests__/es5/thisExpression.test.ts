import { run } from '../helper';

describe('if scope spec:', () => {
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
});
