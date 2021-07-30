import { run } from '../helper';
import { ErrDuplicateDeclare } from '../../src/error';

describe('for scope spec:', () => {
  it('base', () => {
    const res = run(`
      for(var i =0;i<5;i++){
      }
      module.exports = i;
    `);
    expect(res).toEqual(5);
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
