import { run } from '../helper';
import { ErrDuplicateDeclare } from '../../src/error';
import { ScopeType } from '../../src/types';
import { Scope } from '../../src/scope';
import { Context } from '../../src';

describe('for scope spec:', () => {
  it('base root', function () {
    const scope = new Scope(ScopeType.Root, null);
    expect(scope.type).toEqual(ScopeType.Root);
    expect(scope.level).toEqual(0);
    expect(scope.parent).toEqual(null);
    expect(scope.isolated).toBeTruthy();
    expect(scope.invasive).toBeFalsy();
    expect(scope.data).toEqual({});
  });

  it('hasOwnBinding', () => {
    const scope = new Scope(ScopeType.Root, null);
    scope.setContext(new Context());
    expect(!!scope.hasOwnBinding('console')).toBeTruthy();
  });

  it('hasBinding', () => {
    const scope = new Scope(ScopeType.Root, null);
    expect(scope.declareVar('name', 'ximing')).toBeTruthy();

    const child = scope.createChild(ScopeType.Block);

    // can not found the var in the current scope
    expect(child.hasOwnBinding('name')).toEqual(undefined);

    // can found the var in the parent scope
    expect(!!child.hasBinding('name')).toEqual(true);
  });

  it("'var' can be redeclare", () => {
    const scope = new Scope(ScopeType.Root, null);
    expect(scope.declareVar('name', 'ximing')).toBeTruthy();

    const $var: any = scope.hasOwnBinding('name');

    expect($var.value).toEqual('ximing');

    expect(scope.declareVar('name', 'hello')).toBeTruthy(); // redeclare

    const $newVar: any = scope.hasOwnBinding('name');

    expect($var.value).toEqual('ximing');
    expect($newVar.value).toEqual('hello');
  });

  it(`let can't be redeclare`, () => {
    const scope = new Scope(ScopeType.Root, null);
    expect(scope.declareVar('name', 'ximing')).toBeTruthy();

    const $var: any = scope.hasOwnBinding('name');

    expect($var.value).toEqual('ximing');

    expect(() => {
      scope.declareLet('name', 'hello'); // redeclare
    }).toThrowError(ErrDuplicateDeclare('name').message);
  });

  it(`const can't be redeclare`, () => {
    const scope = new Scope(ScopeType.Root, null);
    scope.declareVar('name', 'ximing');
    const $var: any = scope.hasOwnBinding('name');

    expect($var.value).toEqual('ximing');

    expect(() => {
      scope.declareConst('name', 'hello'); // redeclare
    }).toThrowError(ErrDuplicateDeclare('name').message);
  });

  it('delete variable from a scope', () => {
    const scope = new Scope(ScopeType.Root, null);
    scope.declareVar('name', 'ximing');
    const $var: any = scope.hasOwnBinding('name');
    expect($var.value).toEqual('ximing');
    expect(scope.del('name')).toBeTruthy();

    expect(scope.hasOwnBinding('name')).toEqual(undefined);
  });

  it('locate scope', () => {
    const scope = new Scope(ScopeType.Root, null);
    scope.declareVar('name', 'ximing');
    const child = scope.createChild(ScopeType.Block);
    const childChild = child.createChild(ScopeType.Block);
    const target = childChild.locate('name');

    expect(target === scope).toBeTruthy();

    expect(childChild.locate('customerVarName')).toEqual(undefined);
  });

  it('hoisting', () => {
    const res = run(`
      for(var i =0;i<5;i++){
      }
      module.exports = i;
    `);
    expect(res).toEqual(5);
  });
});

describe('function', function () {
  it(`function have it's own scope with var`, function () {
    const res = run(`
    var a = 1;
    function get(){
      var a = 2;
      return a;
    }
    function getA(){
      return a;
    }
    module.exports = {get: get, getA: getA};
`);
    expect(res.get()).toEqual(2);
    expect(res.getA()).toEqual(1);
  });

  it(`function have it's own scope with let`, function () {
    const res = run(`
    var a = 1;
    function get(){
      let a = 2;
      return a;
    }
    function getA(){
      return a;
    }
    module.exports = {get: get, getA: getA};
`);
    expect(res.get()).toEqual(2);
    expect(res.getA()).toEqual(1);
  });

  it(`function have it's own scope with const`, function () {
    const res = run(`
    var a = 1;
    function get(){
      const a = 2;
      return a;
    }
    function getA(){
      return a;
    }
    module.exports = {get: get, getA: getA};
`);
    expect(res.get()).toEqual(2);
    expect(res.getA()).toEqual(1);
  });
});

describe('while', () => {
  it('var in while block should invasive scope', function () {
    expect(
      run(`
      var a = 1;
      while(true){
        var a = 2;
        break;
      }
      module.exports = a;`)
    ).toEqual(2);
  });

  it('var in while block should invasive scope 2', function () {
    expect(
      run(`
      var a = 1;
      while(true){
        a = 2
        var a ;
        break;
      }
      module.exports = a;`)
    ).toEqual(2);
  });

  it('let in while block should not invasive scope', function () {
    expect(
      run(`
      var a = 1;
      var b = 1;
      while(true){
        a = 2
        var a;
        let b = 2;
        break;
      }
      module.exports = {a,b};`)
    ).toEqual({ a: 2, b: 1 });
  });

  it('const in while block should has owner scope ', function () {
    expect(
      run(`
      var a = 1;
      while(true){
        const a = 2;
        break;
      }
      module.exports = a;
    `)
    ).toEqual(1);
  });

  it('variables with the same name in the while scope and the parent scope', function () {
    expect(() =>
      run(`
    let a = 1; 
    while(true){
      var a = 2;// error duplicate declare
      break;
    }
    `)
    ).toThrowError(ErrDuplicateDeclare('a').message);
  });
});

describe('do while', () => {
  it('var in do while block should invasive scope', function () {
    expect(
      run(`
    var a = 1;
    do {
      var a = 2;
    } while (false);
    module.exports = a;
  `)
    ).toEqual(2);
  });

  it('var in do while block should invasive scope 2', function () {
    expect(
      run(`
    var a = 1;
    do {
      a = 2
      var a;
    } while (false);
    module.exports = a;
  `)
    ).toEqual(2);
  });

  it('let in do while block should not invasive scope', function () {
    expect(
      run(`
      var a = 1;
      var b = 1;
      do{
        a = 2
        var a;
        let b = 2;
      }while(false)
      module.exports = {a,b};`)
    ).toEqual({ a: 2, b: 1 });
  });

  it('const in do while block should has owner scope ', function () {
    expect(
      run(`
      var a = 1;
      do{
        const a = 2;
      }while(false)
      module.exports = a;
    `)
    ).toEqual(1);
  });

  it('variables with the same name in the while scope and the parent scope', function () {
    expect(() =>
      run(`
    let a = 1; 
    do{
      var a = 2;// error duplicate declare
      break;
    }while(false)
    `)
    ).toThrowError(ErrDuplicateDeclare('a').message);
  });
});

describe('for', () => {
  it('var in for block should invasive scope', function () {
    expect(
      run(`
      var a = 1;
      for(;;){
        var a = 2;
        break;
      }
      module.exports = a;`)
    ).toEqual(2);
  });

  it('var in for block should invasive scope 2', function () {
    expect(
      run(`
      var a = 1;
      for(;;){
        a = 2;
        var a ;
        break;
      }
      module.exports = a;`)
    ).toEqual(2);
  });

  it('let in for block should not invasive scope', function () {
    expect(
      run(`
      var a = 1;
      var b = 1;
      for(;;){
        a = 2;
        var a;
        let b = 2;
        break;
      }
      module.exports = {a,b};`)
    ).toEqual({ a: 2, b: 1 });
  });

  it('const in for block should has owner scope ', function () {
    expect(
      run(`
      var a = 1;
      for(;;){
        const a = 2;
        break;
      }
      module.exports = a;
    `)
    ).toEqual(1);
  });

  it('variables with the same name in the while scope and the parent scope', function () {
    expect(() =>
      run(`
    let a = 1; 
    for(;;){
      var a = 2;// error duplicate declare
      break;
    }
    `)
    ).toThrowError(ErrDuplicateDeclare('a').message);
  });
});
