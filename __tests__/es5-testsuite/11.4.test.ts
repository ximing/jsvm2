import { run } from '../helper';

describe('11.4', function () {
  // babel 构建时报错
  //   it('11.4.1-0-1', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   var x = 1;
  //   var y = 2;
  //   var z = 3;
  //
  //   if( (!delete x || delete y) &&
  //       delete delete z)
  //   {
  //     return true;
  //   }
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //
  //     expect(a).toBeTruthy();
  //   });

  it('11.4.1-2-1', () => {
    const a = run(
      `
function testcase() {
  var d = delete 42;
  if (d === true) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-2-2', () => {
    const a = run(
      `
function testcase() {
  var bIsFooCalled = false;
  var foo = function(){bIsFooCalled = true;};

  var d = delete foo();
  if(d === true && bIsFooCalled === true)
    return true;
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-2-3', () => {
    const a = run(
      `
function testcase() {
  var d = delete true;
  if (d === true) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-2-4', () => {
    const a = run(
      `
function testcase() {
  var d = delete "abc";
  if (d === true) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-2-5', () => {
    const a = run(
      `
function testcase() {
  var d = delete {a:0} ;
  if (d === true) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-2-6', () => {
    const a = run(
      `
function testcase() {
  var d = delete null;
  if (d === true) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  // babel 构建时报错
  //   it('11.4.1-3-1', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   // just cooking up a long/veryLikely unique name
  //   var d = delete __ES3_1_test_suite_test_11_4_1_3_unique_id_0__;
  //   if (d === true) {
  //     return true;
  //   }
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //
  //     expect(a).toBeTruthy();
  //   });

  it('11.4.1-3-2', () => {
    const a = run(
      `
function testcase() {
  // just cooking up a long/veryLikely unique name
  try
  {
    var d = delete __ES3_1_test_suite_test_11_4_1_3_unique_id_2__.x;
  }
  catch(e)
  {
    if (e instanceof ReferenceError)
      return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-3-3', () => {
    const a = run(
      `
function testcase() {
  var __ES3_1_test_suite_test_11_4_1_3_unique_id_3__ = {};
  var d = delete __ES3_1_test_suite_test_11_4_1_3_unique_id_3__.x;
  if (d === true) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-4.a-1', () => {
    const a = run(
      `
function testcase() {
  var o = {};

  var desc = { value: 1, configurable: true };
  Object.defineProperty(o, "foo", desc);

  var d = delete o.foo;
  if (d === true && o.hasOwnProperty("foo") === false) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-4.a-2', () => {
    const a = run(
      `
function testcase() {
  var o = {};

  // define an accessor
  // dummy getter
  var getter = function () { return 1; }
  var desc = { get: getter, configurable: true };
  Object.defineProperty(o, "foo", desc);
    
  var d = delete o.foo;
  if (d === true && o.hasOwnProperty("foo") === false) {
    return true;
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-4.a-3-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';

  var o = {};
  var desc = { value : 1 }; // all other attributes default to false
  Object.defineProperty(o, "foo", desc);
  
  // Now, deleting o.foo should throw TypeError because [[Configurable]] on foo is false.
  try {
    delete o.foo;
  }
  catch (e) {
    if (e instanceof TypeError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.4.1-4.a-4-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  
  // NaN (15.1.1.1) has [[Configurable]] set to false.
  try {
    delete this.NaN;
  }
  catch (e) {
    if (e instanceof TypeError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  // babel 构建时报错
  //   it('11.4.1-4.a-5', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   var o = new Object();
  //   o.x = 1;
  //   var d;
  //   with(o)
  //   {
  //     d = delete o;
  //   }
  //   if (d === false && typeof(o) === 'object' && o.x === 1) {
  //     return true;
  //   }
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //
  //     expect(a).toBeTruthy();
  //   });

  // babel 构建时报错
  //   it('11.4.1-4.a-6', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   var o = new Object();
  //   o.x = 1;
  //   var d;
  //   with(o)
  //   {
  //     d = delete x;
  //   }
  //   if (d === true && o.x === undefined) {
  //     return true;
  //   }
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });

  // babel 构建时报错
  //   it('11.4.1-4.a-8', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   try {
  //       var o = JSON;
  //       var d = delete JSON;
  //       if (d === true) {
  //         return true;
  //       }
  //   } finally {
  //     JSON = o;
  //   }
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });

  it('11.4.1-4.a-9-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  
  try {
    delete Math.LN2;
  }
  catch (e) {
    if (e instanceof TypeError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('11.4.1-4.a-10', () => {
    const a = run(
      `
 function testcase() {
  try {
      var o = JSON.stringify;
      var d = delete JSON.stringify;
      if (d === true && JSON.stringify === undefined) {
        return true;
      }
  } finally {
    JSON.stringify = o;
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });
  // 严格模式下报错
  //   it('11.4.1-4.a-12', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   var a = [1,2,3]
  //   a.x = 10;
  //   var d = delete a.length
  //   if(d === false && a.length === 3)
  //     return true;
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });

  // babel 构建时报错
  //   it('11.4.1-4.a-13', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   var a = [1,2,3]
  //   a.x = 10;
  //   var d = delete a
  //   if(d === false && Array.isArray(a) === true)
  //     return true;
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });

  it('11.4.1-4.a-14', () => {
    const a = run(
      `
function testcase() {
  var a = [1,2,3]
  a.x = 10;
  var d = delete a[1]
  if(d === true && a[1] === undefined)
    return true;
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('11.4.1-4.a-15', () => {
    const a = run(
      `
function testcase() {
  var a = [1,2,3]
  a.x = 10;
  var d = delete a.x;
  if( d === true && a.x === undefined)
    return true;
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  // babel 构建时报错
  //   it('11.4.1-4.a-16', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //
  //   if(delete arguments === false && arguments !== undefined)
  //     return true;
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });

  it('11.4.1-4.a-17', () => {
    const a = run(
      `
function testcase() {
  function foo(a,b)
  {
    var d = delete arguments[0];
    return (d === true && arguments[0] === undefined);  
  }

  if(foo(1,2) === true)
    return true;
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  // babel 构建时报错
  //   it('11.4.1-5-1-s', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   'use strict';
  //
  //   var x;
  //
  //   // Now, deleting 'x' directly should fail throwing a ReferenceError
  //   // because 'x' evaluates to a strict reference;
  //   try {
  //     delete x;
  //   }
  //   catch (e) {
  //     if (e instanceof ReferenceError) {
  //       return true;
  //     }
  //   }
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });
  //
  //   it('11.4.1-5-2-s', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //   'use strict';
  //   function foo(a,b) {
  //     // Now, deleting 'a' directly should fail throwing a ReferenceError
  //     // because 'a' is direct reference to a function argument;
  //     try {
  //       delete a;
  //     }
  //     catch (e) {
  //       if (e instanceof ReferenceError) {
  //         return true;
  //       }
  //     }
  //   }
  //   return foo(1,2);
  //  }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });
  //
  //   it('11.4.1-5-3-s', () => {
  //     const a = run(
  //       `
  // function testcase() {
  //         "use strict";
  //
  //         var foo = function () {};
  //
  //         // Now, deleting 'foo' directly should fail throwing a ReferenceError
  //         // because 'foo' evaluates to a strict reference;
  //         try {
  //             delete foo;
  //         } catch (e) {
  //             if (e instanceof ReferenceError) {
  //                 return true;
  //             }
  //         }
  //     }
  // module.exports = testcase();
  //     `
  //     );
  //     expect(a).toBeTruthy();
  //   });

  it('11.4.1-4-s', () => {
    const a = run(
      `
function testcase() {
  function test(o) {
    'use strict';
    try {
      o.length = 42;
    }
    catch (e) {
      if (e instanceof TypeError) {
        return true;
      }
    }
  }
  return test(this);
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('11.4.1-5-s', () => {
    const a = run(
      `
function testcase() {
        "use strict";

        try {
            Object.length = 42;
        } catch (e) {
            if (e instanceof TypeError) {
                return true;
            }
        }
    }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('11.4.1-6-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  try {
    Function.length = 42;
  }
  catch (e) {
    if (e instanceof TypeError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('11.4.1-7-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  try {
    Array.length = 42;
  }
  catch (e) {
    if (e instanceof TypeError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });

  it('11.4.1-8-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  try {
    String.length = 42;
  }
  catch (e) {
    if (e instanceof TypeError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );
    expect(a).toBeTruthy();
  });
});
