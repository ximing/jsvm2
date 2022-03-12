import { run } from '../helper';

describe('callback', () => {
  it('define case1', function () {
    const res = run(
      `
function b(cb) {
  return cb();
}
function a(e) {
  b(function e() {
    // fn
    return e;
  });
  // arg
  return e;
}
module.exports = a(1)
  `
    );

    expect(res).toEqual(1);
  });
  it('define case2', function () {
    const res = run(
      `
var d = function c() {
  return c === d
};

module.exports = d()
  `
    );
    expect(res).toEqual(true);
  });

  it('define case3', function () {
    const res = run(
      `
var d = function c() {
  var c = 1;
  return c === d
};

module.exports = d()
  `
    );
    expect(res).toEqual(false);
  });


  it('define case4', function () {
    const res = run(
      `
function b(cb) {
  return cb;
}
function a() {
  b((b = 1));
  return b;
}
module.exports = a()
  `
    );
    expect(res).toEqual(1);
  });
});
