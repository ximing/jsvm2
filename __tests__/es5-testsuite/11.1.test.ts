import { run } from '../helper';

describe('11.1', function () {
  it('11.1.4-0', () => {
    const a = run(
      `
function testcase() {
  var a = [,];
  if (a.length === 1) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });
});
