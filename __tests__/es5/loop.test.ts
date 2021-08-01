import { run } from '../helper';

describe('for spec:', () => {
  it('base', () => {
    const res = run(`
      for(var i =0;i<5;i++){
      }
      module.exports = i;
    `);
    expect(res).toEqual(5);
  });

  it('for continue', function () {
    const res = run(`
      var a = 0;
      for(let i = 0; i<5; i++){
        if(i == 2) continue;
        a++;
      }
      module.exports = a;
    `);
    expect(res).toEqual(4);
  });

  it('for break', function () {
    const res = run(`
      for(var i = 0; i<5; i++){
        if(i==3) {break};
      }
      module.exports = i;
    `);
    expect(res).toEqual(3);
  });
  it('for return', function () {
    const res = run(`
      function fn(){
        for(var i = 0; i<5; i++){
          if(i==3) return i;
        }
      }
      module.exports = fn();
    `);
    expect(res).toEqual(3);
  });
});

describe('do while', () => {
  it('base', function () {
    const res = run(`
      var i = 0;
      do{
        i++;
      }while(i<5)
      module.exports = i;
    `);
    expect(res).toEqual(5);
  });

  it('do while continue', function () {
    const res = run(`
      var i = 0, j = 0;
      do{
        i++;
        if(i==2){ continue }
        j++;
      }while(i<5)
      module.exports = j;
    `);
    expect(res).toEqual(4);
  });

  it('do while break', function () {
    const res = run(`
      var i = 0;
      do{
        if(i==2){ break }
        i++;
      }while(i<5)
      module.exports = i;
    `);
    expect(res).toEqual(2);
  });

  it('do while return', function () {
    const res = run(`
      function fn(){
        var i = 0;
        do{
          if(i==2) return i;
          i++;
        }while(i<5)
      }
      module.exports = fn();
    `);
    expect(res).toEqual(2);
  });
});

describe('while', () => {
  it('base', function () {
    const res = run(`
      var i = 0;
      while(i<5){
        i++;
      }
      module.exports = i;
    `);
    expect(res).toEqual(5);
  });

  it('while continue', function () {
    const res = run(`
      var i = 0, j = 0;
      while(i<5){
        i++;
        if(i==2){ continue }
        j++;
      }
      module.exports = j;
    `);
    expect(res).toEqual(4);
  });

  it('while return', function () {
    const res = run(`
      var i = 0;
      function fn(){
        while(i<5){
          if(i==2) return i;
          i++;
        }
      }
      module.exports = fn();
    `);
    expect(res).toEqual(2);
  });
});

describe('for in', () => {
  it('base', function () {
    const res = run(`
      const obj = {
        a: false,
        1: 0
      };
      for (let attr in obj) {
        obj[attr] = !obj[attr];
      }
      module.exports = obj;
  `);
    expect(res).toEqual({ a: true, 1: true });
  });

  it('break continue', function () {
    const res = run(`
      const obj = {
        a: false,
        b: 0,
        c: '123'
      };
      for(let attr in obj){
        if(attr === 'a') continue;
        if(attr === 'c') break;
        obj[attr] = !!obj[attr];
      }
      module.exports = obj;
    `);
    expect(res).toEqual({
      a: false,
      b: false,
      c: '123',
    });
  });

  it('return', function () {
    const res = run(`
      const obj = {
        a: false,
        1: 0
      };
      function fn(){
        for (let attr in obj) {
          if(attr === 'a') return !obj[attr]
        }
      }
      module.exports = fn();
  `);
    expect(res).toEqual(true);
  });
});
