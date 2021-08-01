import { run } from '../helper';

describe('es2015 function spec:', () => {
  it('new.target without new', function () {
    expect(
      run(`function Human(){ return new.target; }
      module.exports = Human();
    `)
    ).toEqual(undefined);
  });

  it('new.target with new', function () {
    const res = run(`
      let target;
      function Human(){ target = new.target; }
      new Human();
      module.exports = { Human,target };
    `);
    expect(res.Human).toEqual(res.target);
  });
});
