import { run } from './helper';

describe('dev', function () {
  it('context var', function () {
    expect(
      run(
        `
    var a = [];
    function b(){
      return 1;
    }
    module.exports = a.concat(b());
    `,
        {
          global: 2,
        }
      )
    ).toEqual([1]);
  });
});
