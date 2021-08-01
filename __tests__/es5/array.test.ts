import { run } from '../helper';

describe('array expression spec:', () => {
  it('push', () => {
    const arr = run(`
const arr = [1, 2, 3];
arr.push(4);
module.exports = arr;
  `);
    expect(Array.isArray(arr)).toBeTruthy();
    expect(arr.length).toEqual(4);
    expect(arr).toEqual([1, 2, 3, 4]);
  });

  it('undefined null', () => {
    const arr = run(`
  module.exports = [0, false, undefined, null];
  `);
    expect(arr).toEqual([0, false, undefined, null]);
  });

  it('change array', () => {
    const arr = run(`
  var arr = [0, 1, undefined, null];
  arr[0]+=1;
  arr[1] = 100;
  arr[4] = 4;
  module.exports = arr;
  `);
    expect(arr).toEqual([1, 100, undefined, null, 4]);
  });

  it('elements null', () => {
    const arr = run(`
  module.exports = [1,,2];
  `);
    expect(arr.length).toEqual(3);
    expect(arr[2]).toEqual(2);
  });
});
