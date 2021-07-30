import { run } from '../helper';

describe('prototype spec:', () => {
  it('constructor function', () => {
    const res = run(`
    function Human(){}
    Human.prototype.say = function(){}
    module.exports = {human: new Human(), Human};
    `);
    expect(res.human instanceof res.Human).toBeTruthy();
    expect(typeof res.Human).toEqual('function');
    expect(typeof res.human.say).toEqual('function');
  });
});
