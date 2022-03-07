import { run } from '../helper';

describe('class spec:', () => {
  it('babel inheritance', () => {
    const res = run(
      `
    class Parent{
      c = 1;
      b(){
        return this.c;
      }
    }
    class Child extends Parent{
      constructor(){
        super();
        this.a = this.b();
      }
      d(){
        return this.b();
      }
    }
    const child = new Child();
    module.exports = {
      a : child.a
    }
  `,
      {},
      true,
      true
    );
    expect(res.a).toEqual(1);
  });

  it('composition inheritance', () => {
    const res = run(`
        function Parent (name) {
            this.name = name;
            this.colors = ['red', 'blue', 'green'];
        }

        Parent.prototype.getName = function () {
            return this.name;
        }

        function Child (name, age) {
            Parent.call(this, name);
            this.age = age;
            this.n = this.getName()
        }

        Child.prototype = new Parent();
        Child.prototype.constructor = Child;

        var child1 = new Child('ximing', '28');
         module.exports = {
            name: child1.getName(),
            n: child1.n
         }
  `);
    expect(res.name).toEqual('ximing');
    expect(res.n).toEqual('ximing');
  });

  it('parasitic inheritance', () => {
    const res = run(`
      function creator(origin) {
        // 以 origin 为原型对象创建一个新对象
        let clone = Object.create(origin);
      
        // 以某种方式来增强这个对象
        clone.sayHi = function () {
          return 'ximing'
        };
      
        // 返回这个对象
        return clone;
      }
      
      let friendship = {
        name: 'Uzi',
        friends: ['Amy', 'Ben', 'Tom'],
      };
      
      // 具有实例的原型person的所有属性和方法，也有自己的方法
      let uzi = creator(friendship);
      
       module.exports = {
          name:  uzi.sayHi()
       }
`);
    expect(res.name).toEqual('ximing');
  });

  it('parasitic combination inheritance', () => {
    const res = run(`
      function fn(){
        return this;
      }
      function _inherits(subClass, superClass) {
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            writable: true,
            configurable: true
          }
        });
        subClass.__proto__ = superClass;
      }
      function Parent (name) {
          this.name = name;
          this.colors = ['red', 'blue', 'green'];
      }
      Parent.prototype.getName = function () {
          return this.name;
      }
      function Child (name, age) {
          Parent.call(this, name);
          this.age = age;
          this.n = this.getName()
      }
      _inherits(Child, Parent);      
      Child.prototype.getThis = function () {
          return fn();
      }
      var child1 = new Child('ximing', '28');
       module.exports = {
          name: child1.getName(),
          n: child1.n,
          t: child1.getThis()
       }
`);
    expect(res.name).toEqual('ximing');
    expect(res.n).toEqual('ximing');
    expect(res.t).toEqual(undefined);
  });
});
