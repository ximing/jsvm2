import { run } from './helper';

describe('dev', function () {
  it('12.14-1', () => {
    const a = run(
      `
function testcase() {
  foo = "prior to throw";
  try {
    throw new Error();
  } catch (foo) {
    var foo = "initializer in catch";
  }
 return foo === "prior to throw";
 }
module.exports = testcase();
    `,
      {},
      true
    );
    expect(a).toBeTruthy();
  });
});
