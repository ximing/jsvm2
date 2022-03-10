import { run } from '../helper';

describe('12.14', function () {
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

  it('12.14-2', () => {
    const a = run(
      `
function testcase() {
  function capturedFoo() {return foo};
  foo = "prior to throw";
  try {
    throw new Error();
  }
  catch (foo) {
    var foo = "initializer in catch";
    return capturedFoo() !== "initializer in catch";
  }
 }
module.exports = testcase();
    `,
      {},
      true
    );
    expect(a).toBeTruthy();
  });

  it('12.14-3', () => {
    const a = run(
      `
function testcase() {
  try {
    throw new Error();
  }
  catch (e) {
    var foo = "declaration in catch";
  }
  
  return foo === "declaration in catch";
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-4', () => {
    const a = run(
      `
function testcase() {
  var o = { foo : 42};
  try {
    throw o;
  }
  catch (e) {
    var foo;
    if (foo === undefined) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-5', () => {
    const a = run(
      `
function testcase() {
  var o = {foo: function () { return 42;}};
  try {
    throw o;
  }
  catch (e) {
    function foo() {}
    if (foo() === undefined) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-6', () => {
    const a = run(
      `
function testcase() {
  var o = {foo : function () { return 42;}};
  try {
    throw o;
  }
  catch (e) {
    var foo = function () {};
    if (foo() === undefined) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-7', () => {
    const a = run(
      `
function testcase() {
  var o = {foo: 1};
  try {
    throw o;
  }
  catch (e) {
    var f = e.foo;
  }
  try {
    foo;
  }
  catch (e) {
    // actually, we need to have thrown a ReferenceError exception.
    // However, in JScript we have thrown a TypeError exception.
    // But that is a separate test.
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-8', () => {
    const a = run(
      `
function testcase() {
  var o = {foo: 42};
  try {
    throw o;
  }
  catch (e) {
    var foo = 1;
  }
  if (o.foo === 42) {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-9', () => {
    const a = run(
      `
function testcase() {
  function f(o) {
    var x = 42;
    function innerf(o) {
      try {
        throw o;
      }
      catch (e) {
        return x;
      }
    }
    return innerf(o);
  } 
  if (f({}) === 42) {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-10', () => {
    const a = run(
      `
function testcase() {
  function f(o) {
    function innerf(o, x) {
      try {
        throw o;
      }
      catch (e) {
        return x;
      }
    }
    return innerf(o, 42);
  } 
  if (f({}) === 42) {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-11', () => {
    const a = run(
      `
function testcase() {
  function f(o) {
    function innerf(o) {
      var x = 42;
      try {
        throw o;
      }
      catch (e) {
        return x;
      }
    }
    return innerf(o);
  }
  if (f({}) === 42) {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-12', () => {
    const a = run(
      `
function testcase() {
  function f(o) {
    function innerf(o) {
      try {
        throw o;
      }
      catch (e) {
        return e.x;
      }
    }
    return innerf(o);
  } 
  if (f({x:42}) === 42) {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('12.14-13', () => {
    const a = run(
      `
function testcase() {
  var res1 = false;
  var res2 = false;
  var res3 = false;
  var x_12_14_13 = 'local';
  function foo() {
    this.x_12_14_13  = 'instance';
  }
  try {
    throw foo;
  } catch (e) {
    res1 = (x_12_14_13  === 'local');
    e.apply({});
    res2 = (x_12_14_13  === 'local');
  }
  res3 = (x_12_14_13  === 'local');
  if (res1 === true &&
      res2 === true &&
      res3 === true) {
    return true;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });
});
