import { run } from '../helper';

describe('object spec:', () => {
  it('factory', () => {
    const res = run(
      `
    function createPerson(name, age, job) {
      let person = new Object();
      person.name = name;
      person.age = age;
      person.job = job;
      person.sayName = function () {
        return name
      };
    
      return person;
    }
    module.exports = {
      p : createPerson('Ben', 21, 'student')
    }
  `,
      {},
      true,
      true
    );
    expect(res.p.name).toEqual('Ben');
    expect(res.p.age).toEqual(21);
    expect(res.p.sayName()).toEqual('Ben');
  });

  it('constructor', () => {
    const res = run(`
        function Person(name, age, job){
          this.name = name;
          this.age = age;
          this.job = job;
          this.sayName = function(){
            return name
          }
        }
         module.exports = {
            p: new Person('Ben', 21, 'student')
         }
  `);
    expect(res.p.name).toEqual('Ben');
    expect(res.p.age).toEqual(21);
    expect(res.p.sayName()).toEqual('Ben');
  });

  it('prototype', () => {
    const res = run(`
      function Person(){}

      Person.prototype.name = 'Uzi';
      Person.prototype.age = 22;
      Person.prototype.job = 'E-Sports Player';
      Person.prototype.sayName = function(){
        return this.name;
      }
       module.exports = {
          p: new Person()
       }
`);
    expect(res.p.name).toEqual('Uzi');
    expect(res.p.age).toEqual(22);
    expect(res.p.sayName()).toEqual('Uzi');
  });

  it('combination constructor and prototype', () => {
    const res = run(`
      function Person(name, age, job){
        this.name = name;
        this.age = age;
        this.job = job;
        this.friends = ['Amy', 'Ben'];
      }
      Person.prototype = {
        constructor: Person,
        sayName: function(){
          return this.name;
        }
      }
      module.exports = {
          p: new Person('Ben', 21, 'student')
      }
`);
    expect(res.p.name).toEqual('Ben');
    expect(res.p.age).toEqual(21);
    expect(res.p.sayName()).toEqual('Ben');
  });

  it('dynamic prototype pattern', () => {
    const res = run(`
      function Person(name, age, job) {
        // 属性
        this.name = name;
        this.age = age;
        this.job = job;
      
        // 方法（动态插入原型方法）
        if (typeof this.sayName != 'function'){
          Person.prototype.sayName = function(){
            return this.name;
          }
        }
      }
      module.exports = {
          p: new Person('Ben', 21, 'student')
      }
`);
    expect(res.p.name).toEqual('Ben');
    expect(res.p.age).toEqual(21);
    expect(res.p.sayName()).toEqual('Ben');
  });

  it('parastic constructor pattern', () => {
    const res = run(`
      function Person(name, age, job){
        let obj = new Object();
        obj.name = name;
        obj.age = age;
        obj.job = job;
        obj.sayName = function(){
            return this.name;
        };
      
        return obj;
      }
      module.exports = {
          p: new Person('Ben', 21, 'student')
      }
`);
    expect(res.p.name).toEqual('Ben');
    expect(res.p.age).toEqual(21);
    expect(res.p.sayName()).toEqual('Ben');
  });

  it('durable constructor pattern', () => {
    const res = run(`
      function Person(name, age, job) {
        // 创建要返回的对象
        const obj = new Object();
        // 可以在这里定义私有变量和函数
        // 添加方法
        obj.sayName = function() {
          return name;
        };
        // 返回对象
        return obj;
      }
      module.exports = {
          p: new Person('Ben', 21, 'student')
      }
`);
    expect(res.p.sayName()).toEqual('Ben');
  });
});
