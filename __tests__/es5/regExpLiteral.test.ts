import { run } from '../helper';

describe('array expression spec:', () => {
  it('basic without flags', () => {
    const func = run(
      `
var reg = /^hello/;
function isSayHi(word) {
  return reg.test(word);
}
 module.exports = isSayHi;
  `
    );

    expect(func('hello world')).toBeTruthy();
    expect(func('abcd')).not.toBeTruthy();
  });

  it('with flags', () => {
    const func = run(
      `
var reg = /^hello/i;
function isSayHi(word) {
  return reg.test(word);
}
 module.exports = isSayHi;
  `
    );

    expect(func('hello world')).toBeTruthy();
    expect(func('Hello woRld')).toBeTruthy();
  });

  it('with multiple flags', () => {
    const func = run(
      `
var reg = /^hello/im;
function isSayHi(word) {
  return reg.test(word);
}
  module.exports = isSayHi;
  `
    );
    expect(func('hello world')).toBeTruthy();
    expect(func('hello woRld')).toBeTruthy();
    expect(func('hello \nwoRld')).toBeTruthy();
  });
});
