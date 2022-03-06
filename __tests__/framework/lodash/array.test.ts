import { _ } from './lodash';

describe('lodash array spec:', () => {
  it('chunk', () => {
    expect(_.chunk(['a', 'b', 'c', 'd'], 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
    expect(_.chunk(['a', 'b', 'c', 'd'], 3)).toEqual([['a', 'b', 'c'], ['d']]);
  });
  it('compact', () => {
    expect(_.compact([0, 1, false, 2, '', 3])).toEqual([1, 2, 3]);
  });
  it('concat', () => {
    var array = [1];
    var other = _.concat(array, 2, [3], [[4]]);
    expect(other).toEqual([1, 2, 3, [4]]);
  });
  it('difference', () => {
    expect(_.difference([2, 1], [2, 3])).toEqual([1]);
  });
  it('differenceBy', () => {
    expect(_.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([1.2]);
    expect(_.differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], 'x')).toEqual([
      { x: 2 },
    ]);
  });
  it('differenceWith', () => {
    var objects = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ];
    expect(_.differenceWith(objects, [{ x: 1, y: 2 }], _.isEqual)).toEqual([
      { x: 2, y: 1 },
    ]);
  });
  it('drop', () => {
    expect(_.drop([1, 2, 3])).toEqual([2, 3]);
    expect(_.drop([1, 2, 3], 2)).toEqual([3]);
    expect(_.drop([1, 2, 3], 5)).toEqual([]);
    expect(_.drop([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
  it('dropRight', () => {
    expect(_.dropRight([1, 2, 3])).toEqual([1, 2]);
    expect(_.dropRight([1, 2, 3], 2)).toEqual([1]);
    expect(_.dropRight([1, 2, 3], 5)).toEqual([]);
    expect(_.dropRight([1, 2, 3], 0)).toEqual([1, 2, 3]);
  });
  // it('dropRightWhile', () => {
  //   var users = [
  //     { 'user': 'barney',  'active': true },
  //     { 'user': 'fred',    'active': false },
  //     { 'user': 'pebbles', 'active': false }
  //   ];
  //   expect(_.dropRight([1, 2, 3])).toEqual([1, 2]);
  //   expect(_.dropRight([1, 2, 3], 2)).toEqual([1]);
  //   expect(_.dropRight([1, 2, 3], 5)).toEqual([]);
  //   expect(_.dropRight([1, 2, 3], 0)).toEqual([1, 2, 3]);
  // });
  it('fill', () => {
    var array = [1, 2, 3];
    expect(_.fill(array, 'a')).toEqual(['a', 'a', 'a']);
    expect(_.fill(Array(3), 2)).toEqual([2, 2, 2]);
    expect(_.fill([4, 6, 8, 10], '*', 1, 3)).toEqual([4, '*', '*', 10]);
  });
  it('flatten', () => {
    expect(_.flatten([1, [2, [3, [4]], 5]])).toEqual([1, 2, [3, [4]], 5]);
  });
  it('flattenDeep', () => {
    expect(_.flattenDeep([1, [2, [3, [4]], 5]])).toEqual([1, 2, 3, 4, 5]);
  });
  it('flattenDepth', () => {
    var array = [1, [2, [3, [4]], 5]];
    expect(_.flattenDepth(array, 1)).toEqual([1, 2, [3, [4]], 5]);
    expect(_.flattenDepth(array, 2)).toEqual([1, 2, 3, [4], 5]);
  });
  it('head', () => {
    expect(_.head([1, 2, 3])).toEqual(1);
    expect(_.head([])).toEqual(undefined);
  });
  it('indexOf', () => {
    expect(_.indexOf([1, 2, 1, 2], 2)).toEqual(1);
    expect(_.indexOf([1, 2, 1, 2], 2, 2)).toEqual(3);
  });
  it('initial', () => {
    expect(_.initial([1, 2, 3])).toEqual([1, 2]);
  });
  it('intersection', () => {
    expect(_.intersection([2, 1], [2, 3])).toEqual([2]);
  });
  it('intersectionBy', () => {
    expect(_.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor)).toEqual([2.1]);
    expect(_.intersectionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x')).toEqual([
      { x: 1 },
    ]);
  });
  it('intersectionWith', () => {
    var objects = [
      { x: 1, y: 2 },
      { x: 2, y: 1 },
    ];
    var others = [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
    expect(_.intersectionWith(objects, others, _.isEqual)).toEqual([
      { x: 1, y: 2 },
    ]);
  });
  it('join', () => {
    expect(_.join(['a', 'b', 'c'], '~')).toEqual('a~b~c');
  });
  it('pull', () => {
    var array = ['a', 'b', 'c', 'a', 'b', 'c'];
    _.pull(array, 'a', 'c');
    expect(array).toEqual(['b', 'b']);
  });
  it('reverse', () => {
    var array = [1, 2, 3];
    expect(_.reverse(array)).toEqual([3, 2, 1]);
    expect(array).toEqual([3, 2, 1]);
  });
  it('union', () => {
    expect(_.union([2], [1, 2])).toEqual([2, 1]);
  });
  it('unionBy', () => {
    expect(_.unionBy([2.1], [1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
    expect(_.unionBy([{ x: 1 }], [{ x: 2 }, { x: 1 }], 'x')).toEqual([
      { x: 1 },
      { x: 2 },
    ]);
  });
  it('zip', () => {
    expect(_.zip(['a', 'b'], [1, 2], [true, false])).toEqual([
      ['a', 1, true],
      ['b', 2, false],
    ]);
  });
});
