import { run } from '../helper';

// https://segmentfault.com/a/1190000014018241
describe('for statement spec:', () => {
  it('break ', function () {
    const res = run(`
      var num = 0;
      outermost:
      for (var i=0; i < 10; i++) {
           for (var j=0; j < 10; j++) {
              if (i == 5 && j == 5) {
                  break outermost;
              }
              num++; 
          }
      }
      module.exports = num;
    `);
    expect(res).toEqual(55);
  });

  it('continue', function () {
    expect(
      run(`
    var num = 0;
    outermost:
    for (var i=0; i < 10; i++) {
        for (var j=0; j < 10; j++) { 
            if (i == 5 && j == 5) { 
                continue outermost;
        }
            num++; 
       }
    }
    module.exports = num;
`)
    ).toEqual(95);
  });

  it('endless for loop with label', () => {
    const { i, m, y } = run(
      `
      loop1:
      for (var i=0;i<3;i++) {
        loop2:
        for (var m=1;m<3;m++){
          if (m%2===0){
            break loop1;
          }
          loop3:
          for (var y = 1; y < 10; y++){
            if (y%5===0){
              break loop2;
            }
          }
        }
      }
      module.exports = {i: i, m: m, y: y};
  `
    );
    expect(i).toEqual(3);
    expect(m).toEqual(1);
    expect(y).toEqual(5);
  });

  it('continue with label', () => {
    const { i, m, y } = run(
      `
        loop1:
        for (var i=0;i<3;i++) {
          loop2:
          for (var m=1;m<3;m++){
            if (m%2===0){
              break loop1;
            }
            loop3:
            for (var y = 1; y < 10; y++){
              if (y%5===0){
                continue loop2; // skip loop2
              }
            }
          }
        }
        module.exports = {i: i, m: m, y: y};
  `
    );
    expect(i).toEqual(0);
    expect(m).toEqual(2);
    expect(y).toEqual(5);
  });
});

describe('while statement spec:', () => {
  it('break', function () {
    const res = run(`
    var i = 1;
    loop1:
    while(true){
      i++;
      break loop1;
    }
    module.exports = i;
    `);
    expect(res).toEqual(2);
  });

  it('continue', function () {
    const res = run(`
      var i = 10;
      var arr = [];
      loop1:
      while(i > 0){
        if (i % 2 === 1){
          i--;    
          continue loop1; 
        }
        arr.push(i);  
        i--;  
      }
      module.exports = {i, arr};
    `);
    expect(res.i).toEqual(0);
    expect(res.arr).toEqual([10, 8, 6, 4, 2]);
  });

  it('while while', function () {
    const res = run(`
      var i = 10;
      var arr = [];
      loop1:
      while(i > 0){
        if (i % 2 === 1){
          while(i>5){
              i--;
              if(i===6){
                continue loop1;
              }
          }
        }
        arr.push(i);
        i--;
      }
      module.exports = {i, arr};
    `);
    expect(res.i).toEqual(0);
    expect(res.arr).toEqual([10, 6, 5, 4, 3, 2, 1]);
  });
});

describe('do while statement spec:', () => {
  it('break', function () {
    expect(
      run(`
    var a = 1;
    doLoop:
    do {
      a++;
      break doLoop;
    } while (true);
    module.exports = a;
    `)
    ).toEqual(2);
  });

  it('continue', function () {
    expect(
      run(`
      var a = 1;
      doLoop:
      do {
        a++;
        continue doLoop;
      } while (a<10);
      module.exports = a;
    `)
    ).toEqual(10);
  });
});

describe('for in statement spec:', () => {
  it('break', function () {
    expect(
      run(`
    var obj = {
      1: false,
      2: false,
      3: false
    };
    loop1:
    for (var attr in obj) {
      obj[attr] = true;
      if (attr % 2 === 0){
        break loop1;
      }
    }
    module.exports = obj;
`)
    ).toEqual({
      1: true,
      2: true,
      3: false,
    });
  });

  it('break 2', function () {
    expect(
      run(`
    var obj = {
      1: false,
      2: false,
      3: false
    };
    loop1:
    for (var attr in obj) {
      obj[attr] = true;
      loop2:
      for (var index in [1,2,3,4]){
        if ((index + 1)%3 === 0){
          break loop1;
        }
      }
    }
    module.exports = {attr, index};
    `)
    ).toEqual({ attr: '1', index: '2' });
  });
  it('continue', function () {
    expect(
      run(`
      var obj = {
        1: false,
        2: false,
        3: false
      };
      loop1:
      for (var attr in obj) {
        obj[attr] = true;
        loop2:
        for (var index in [1,2,3,4]){
          if ((index + 1)%3 === 0){
            break loop1;
          }
          loop3:
          for (var m in [1, 2, 3, 4]){
            if ((m + 1) % 2 === 0){
              continue loop2;
            }
          }
        }
      }
      module.exports = {attr, index,m};
    `)
    ).toEqual({
      attr: '1',
      index: '2',
      m: '3',
    });
  });
  it('block break', function () {
    expect(
      run(`
      var obj = {
        a: false,
        b: false,
        c: false
      };
      foo: {
        obj.a = true;
        break foo;
        obj.b = true;
      }
      obj.c = true;
      module.exports = obj;
    `)
    ).toEqual({
      a: true,
      b: false,
      c: true,
    });
  });
  it('function block break', function () {
    expect(
      run(`
      var obj = {
        a: false,
        b: false,
        c: false
      };
      function render(){
        foo: {
          obj.a = true;
          break foo;
          obj.b = true;
        }
        obj.c = true;
      }
      render()
      module.exports = obj;
    `)
    ).toEqual({
      a: true,
      b: false,
      c: true,
    });
  });
});
