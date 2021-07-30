import { run } from '../helper';

describe('arrow function spec:', () => {
  it('return', function () {
    const fn = run(
      `
      const func = () => "hello " + this;
      module.exports = func;
    `,
      {}
    );
    expect(fn()).toEqual('hello undefined');
    expect(fn.name).toEqual('');
  });
  it('scope', function () {
    const fn = run(
      `
      function fn() {
        return () => this.name;;
      }
      function call(name) {
        return fn.call({name})();
      }
      module.exports = call;
    `
    );
    expect(fn('ximing')).toEqual('ximing');
  });
});
