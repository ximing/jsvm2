import { run } from '../helper';

describe('es2015 variable spec:', () => {
  it('objectPattern', function () {
    expect(
      run(`
      var obj = {attr1:1,attr2:2};
      var {attr1,attr2} = obj;
      module.exports = attr1
    `)
    ).toEqual(1);
  });

  it('arrayPattern', function () {
    expect(
      run(`
      var arr = [1,2,3];
      var [a1,a2,a3] = arr;
      module.exports = a2
    `)
    ).toEqual(2);
  });
});
