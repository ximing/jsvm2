import { run } from '../helper';

describe('es2015 array expression spec:', () => {
  it('spread arr', () => {
    const arr = run(`
      const arr = [1, 2, 3];
      const arr1 = [...arr, 4,5,6]
      module.exports = arr1;
  `);
    expect(Array.isArray(arr)).toBeTruthy();
    expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('spread arr', () => {
    const obj1 = run(`
      const obj = {a:1,b:2};
      const obj1 = {...obj,c:3};
      module.exports = obj1;
  `);
    expect(obj1).toEqual({ a: 1, b: 2, c: 3 });
  });
});
