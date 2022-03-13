import { run } from './helper';

describe('dev', function () {
  it('context var', function () {
    expect(
      run(
        `
    var global = 1;
    console.log(global)
    module.exports = global;
    `,
        {
          global: 2,
        }
      )
    ).toEqual(1);
  });
});
