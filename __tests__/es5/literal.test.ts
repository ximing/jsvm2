import { run } from '../helper';
describe('literal spec:', () => {
  it('base', function () {
    expect(
      run(`
  module.exports = {
    a: "1",
    b: 0,
    c: false,
    d: undefined,
    e: null
  };
`)
    ).toEqual({
      a: '1',
      b: 0,
      c: false,
      d: undefined,
      e: null,
    });
  });
});

describe('reg', function () {
  it('basic without flags', () => {
    const fn = run(`
      const reg = /^hello/;
      function isSayHi(word) {
        return reg.test(word);
      }
      module.exports = isSayHi;
  `);

    expect(fn('hello world')).toBeTruthy();
    expect(fn('abcd')).toBeFalsy();
  });

  it('with flags', () => {
    const fn = run(`
      const reg = /^hello/i;
      function isSayHi(word) {
        return reg.test(word);
      }
      module.exports = isSayHi;
  `);
    expect(fn('hello world')).toBeTruthy();
    expect(fn('Hello woRld')).toBeTruthy();
  });

  it('with multiple flags', () => {
    const fn = run(
      `
        const reg = /^hello/im;
        function isSayHi(word) {
          return reg.test(word);
        }
        module.exports = isSayHi;
  `
    );

    expect(fn('hello world')).toBeTruthy();
    expect(fn('Hello woRld')).toBeTruthy();
    expect(fn('Hello \nwoRld')).toBeTruthy();
  });
});
