'use strict';
function b(cb) {
  return cb;
}
function a(e) {
  b((b = 1));
  // arg
  return b;
}
var d = function c() {
  // var c = 2;
  console.log(c === d);
};

(function f() {
  console.log(f);
})();

d();
