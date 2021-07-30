import { run } from '../helper';

describe('if scope spec:', () => {
  it('base', function () {
    expect(
      run(`
      function Human(){
        this.name = "ximing";
      }
      const human = new Human();
      module.exports = human.name;
    `)
    ).toEqual('ximing');
  });
});
