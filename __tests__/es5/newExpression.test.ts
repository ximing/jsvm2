import { run } from '../helper';

function deepEqual(a, b) {
  expect(a).toEqual(b);
}
describe('sequence expression spec:', () => {
  it('basic', () => {
    const a = run(
      `
var a = (1 , 2);
 module.exports = a;
  `
    );
    expect(a).toEqual(2);
  });
  it('NewExpression', () => {
    const { people, People } = run(
      `
function People(name, age){
  this.name = name;
}
module.exports = {
  people: new People("eval5", 12),
  People: People
};
  `
    );

    // constructor
    deepEqual(People.length, 2);
    deepEqual(People.name, 'People');

    // entity
    deepEqual(true, people instanceof People);
    deepEqual(people.name, 'eval5');
    deepEqual(true, people.constructor === People);
  });

  it('NewExpression for built-in functions', () => {
    const { array, date, regexp } = run(
      `
    var array = new Array(1, 2, 3);
    var date = new Date();
    var regexp = new RegExp('abc');
   module.exports =  {
      array: array,
      date: date,
      regexp: regexp
    }
  `
    );

    deepEqual(array.length, 3);
    deepEqual(true, date <= new Date());
    deepEqual(true, regexp instanceof RegExp);
  });

  it('NewExpression for constructor function which return object', () => {
    const { o, p } = run(
      `
    var o = {
      a: 1
    }
    function P() {
      this.name = 1
      return o
    }
    var p = new P()
    module.exports = {
      o: o,
      p: p
    }
    `
    );

    deepEqual(o, p);
  });
});
