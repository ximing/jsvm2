import { run } from '../helper';

describe('array expression spec:', () => {
  it('spread', () => {
    const arr = run(`
const arr = [1, 2, 3];
const arr1 = [...arr, 4,5,6]
module.exports = arr1;
  `);
    expect(Array.isArray(arr)).toBeTruthy();
    expect(arr).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
