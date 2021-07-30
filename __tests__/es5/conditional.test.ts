import { run } from '../helper';
describe('if spec:', function () {
  it('if ', function () {
    expect(
      run(`
      var a = 0;
      if(true){
        a = 1;
        if(true){
          a = 2;
        }
        if(false){
          a = 0;
        }
      }
      module.exports = a;
    `)
    ).toEqual(2);
  });
  it('if else', function () {
    expect(
      run(`
      var a = 0;
      if(false){
        a = 1;
      }else{
        a = 2
      }
      module.exports = a;
    `)
    ).toEqual(2);
  });
  it('if else else if', function () {
    expect(
      run(`
      var a = 0;
      if(false){
        a = 1;
      }else if(true){
        a = 2
      }
      module.exports = a;
    `)
    ).toEqual(2);
  });
  it('if else else if else', function () {
    expect(
      run(`
      var a = 0;
      if(false){
        a = 1;
      }else if(false){
        a = 2
      }else{
        a = 3
      }
      module.exports = a;
    `)
    ).toEqual(3);
  });
});

describe('switch spec:', function () {
  it('base', function () {
    const fn = run(`
      function fn(type) {
        switch (type) {
          case 1:
            return 2;
          case 2:
            return 3;
          default:
            return 4;
        }
      }
      module.exports = fn;
    `);
    expect(fn(1)).toEqual(2);
    expect(fn(2)).toEqual(3);
    expect(fn(3)).toEqual(4);
  });

  it('switch break', function () {
    const fn = run(`
      function fn(type) {
        let res = 0;
        switch (type) {
          case 1:
            res = 2;
            break;
          case 2:
          case 3:
            res = 3;
            break;
          default:
            res = 4;
        }
        return res;
      }
      module.exports = fn;
    `);
    expect(fn(1)).toEqual(2);
    expect(fn(2)).toEqual(3);
    expect(fn(3)).toEqual(3);
    expect(fn(4)).toEqual(4);
  });
});

describe('conditionalExpression spec:', () => {
  it('base', () => {
    const res = run(`module.exports = true ? 1 : 2;`);
    expect(res).toEqual(1);
  });
  it('function call ', function () {
    const res = run(`
      function a(){return false}
      module.exports = a() ? 1 : 2;
    `);
    expect(res).toEqual(2);
  });
  it('function return', function () {
    const res = run(`
      function a(b){return b>0?b:-1}
      module.exports = a;
    `);
    expect(res(2)).toEqual(2);
  });
});
