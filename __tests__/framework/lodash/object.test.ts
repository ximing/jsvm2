import { _ } from './lodash';

describe('lodash object spec:', () => {
  it('assign', () => {
    function Foo() {
      this.a = 1;
    }
    function Bar() {
      this.c = 3;
    }
    Foo.prototype.b = 2;
    Bar.prototype.d = 4;
    expect(_.assign({ a: 0 }, new Foo(), new Bar())).toEqual({ a: 1, c: 3 });
  });

  it('invert', () => {
    var object = { a: 1, b: 2, c: 1 };
    expect(_.invert(object)).toEqual({ 1: 'c', 2: 'b' });
  });

  it('omit', () => {
    var object = { a: 1, b: '2', c: 3 };
    expect(_.omit(object, ['a', 'c'])).toEqual({ b: '2' });
  });

  it('pickBy', () => {
    var object = { a: 1, b: '2', c: 3 };
    expect(_.pickBy(object, _.isNumber)).toEqual({ a: 1, c: 3 });
  });

  it('result', () => {
    var object = { a: [{ b: { c1: 3, c2: _.constant(4) } }] };
    expect(_.result(object, 'a[0].b.c1')).toEqual(3);
    expect(_.result(object, 'a[0].b.c2')).toEqual(4);
    expect(_.result(object, 'a[0].b.c3', 'default')).toEqual('default');
    expect(_.result(object, 'a[0].b.c3', _.constant('default'))).toEqual(
      'default'
    );
  });

  it('set', () => {
    var object: any = { a: [{ b: { c: 3 } }] };
    _.set(object, 'a[0].b.c', 4);
    expect(object.a[0].b.c).toEqual(4);
    _.set(object, ['x', '0', 'y', 'z'], 5);
    expect(object.x[0].y.z).toEqual(5);
  });
});
