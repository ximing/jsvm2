import { _ } from './lodash';

describe('lodash collection spec:', () => {
  it('countBy', () => {
    expect(_.countBy([6.1, 4.2, 6.3], Math.floor)).toEqual({ 4: 1, 6: 2 });
    expect(_.countBy(['one', 'two', 'three'], 'length')).toEqual({
      3: 2,
      5: 1,
    });
  });

  it('every', () => {
    expect(_.every([true, 1, null, 'yes'], Boolean)).toEqual(false);
    const users = [
      { user: 'barney', age: 36, active: false },
      { user: 'fred', age: 40, active: false },
    ];
    expect(_.every(users, { user: 'barney', active: false })).toEqual(false);
    expect(_.every(users, ['active', false])).toEqual(true);
    expect(_.every(users, 'active')).toEqual(false);
  });

  it('groupBy', () => {
    expect(_.groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({
      4: [4.2],
      6: [6.1, 6.3],
    });
    expect(_.groupBy(['one', 'two', 'three'], 'length')).toEqual({
      3: ['one', 'two'],
      5: ['three'],
    });
  });

  it('invokeMap', () => {
    expect(
      _.invokeMap(
        [
          [5, 1, 7],
          [3, 2, 1],
        ],
        'sort'
      )
    ).toEqual([
      [1, 5, 7],
      [1, 2, 3],
    ]);
    expect(_.invokeMap([123, 456], String.prototype.split, '')).toEqual([
      ['1', '2', '3'],
      ['4', '5', '6'],
    ]);
  });
});
