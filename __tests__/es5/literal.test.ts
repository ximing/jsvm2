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
