import { run } from '../helper';

describe('15.2', function () {
  it('15.12.2-0-3', () => {
    const a = run(
      `
function testcase() {
  var f = JSON.parse;
  if (typeof(f) === "function") {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });
  it('15.12.2-0-3', () => {
    const a = run(
      `
function testcase() {
        var f = JSON.parse;
        if (typeof f === "function" && f.length === 2) {
            return true;
        }
    }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });
  it('15.12.2-0-3', () => {
    const a = run(
      `
function testcase() {
        var o = JSON;
        var desc = Object.getOwnPropertyDescriptor(o, "parse");
        return desc.configurable === true;
    }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });
});
