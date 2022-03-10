import { run } from '../helper';

describe('sequence expression spec:', () => {
  it('basic', () => {
    const a = run(
      `
var a = (1 , 2);
 module.exports = a;
  `
    );
    expect(a).toEqual(2);
  });

  test('with call expression', () => {
    const { a, b } = run(
      `
var a = (get() , 2);
var b;
function get(){
  b = 3;
}
  module.exports = {a: a, b: b};
  `
    );
    expect(a).toEqual(2);
    expect(b).toEqual(3);
  });

  test('with call expression', () => {
    const { a, b } = run(
      `
var b;    
var a = (get() , 2);
function get(){
  b = 3;
}
 module.exports = {a: a, b: b};
  `
    );
    expect(a).toEqual(2);
    expect(b).toEqual(3);
  });
});
