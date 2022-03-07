import { run } from '../helper';

describe('prototype spec:', () => {
  it('temp prototype', () => {
    const res = run(`
    var objectProto = Object.prototype
    var nativeObjectToString = objectProto.toString;
    function objectToString(value) {
        return nativeObjectToString.call(value);
    }
    module.exports = objectToString("")
  `);
    expect(res).toEqual('[object String]');
  });

  it('constructor function case 1', () => {
    const res = run(`
    function Human(){}
    Human.prototype.say = function(){}
    module.exports = {human: new Human(), Human};
    `);
    expect(res.human instanceof res.Human).toBeTruthy();
    expect(typeof res.Human).toEqual('function');
    expect(typeof res.human.say).toEqual('function');
  });

  it('constructor function case 2', () => {
    const res = run(`
    const Foo = function () {};
    const foo = new Foo();
    module.exports = {
      case1: foo.__proto__ === Foo.prototype,
      case2: Object.getPrototypeOf(foo) === Foo.prototype
    };
    `);
    expect(typeof res.case1).toBeTruthy();
    expect(typeof res.case2).toBeTruthy();
  });

  it('constructor function case 3', () => {
    const res = run(`
    module.exports = {
      case1: Function.constructor === Function,
      case2: Object.constructor === Function,
      case3: Function.__proto__.__proto__ === Object.prototype,
      case4: Object.__proto__ === Function.prototype,
      case5: Function.prototype === Function.__proto__
    };
    `);
    expect(typeof res.case1).toBeTruthy();
    expect(typeof res.case2).toBeTruthy();
  });
});
