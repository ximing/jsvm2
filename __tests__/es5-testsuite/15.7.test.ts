import { run } from '../helper';

describe('15.7', function () {
  it('15.7.3.1-1', () => {
    const a = run(
      `
function testcase() {
  var d = Object.getOwnPropertyDescriptor(Number, 'prototype');
  if (d.writable === false &&
      d.enumerable === false &&
      d.configurable === false) {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('15.7.3-1', () => {
    const a = run(
      `
function testcase() {
        // assume that Number.prototype has not been modified.
        return Object.getPrototypeOf(new Number(42)) === Number.prototype;
}
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('15.7.3-2', () => {
    const a = run(
      `
function testcase() {
        var p = Object.getPrototypeOf(Number);
        if (p === Function.prototype) {
            return true;
        }
    }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('15.7.4-1', () => {
    const a = run(
      `
function testcase() {
  var numProto = Object.getPrototypeOf(new Number(42));
  var s = Object.prototype.toString.call(numProto );
  return (s === '[object Number]') ;
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });
});
