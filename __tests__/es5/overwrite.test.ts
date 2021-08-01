import { run } from '../helper';

describe('', function () {
  test('overwrite native toString method', () => {
    const { d, Demo } = run(
      `
        var Demo = function(text) {};
        Demo.prototype = {
          toString: function() {
            return JSON.stringify(this);
          }
        };
        var d = new Demo();
        module.exports = {d: d, Demo: Demo};
    `
    );
    expect(typeof d.toString).toEqual('function');
    expect(typeof Demo).toEqual('function');
    expect(d.toString).toEqual(Demo.prototype.toString);
    expect(d.__proto__).toEqual(Demo.prototype);
  });
});
