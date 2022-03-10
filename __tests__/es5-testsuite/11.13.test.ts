import { run } from '../helper';

describe('11.13', function () {
  it('11.13.1-1-5-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  try {
    __ES3_1_test_suite_test_11_13_1_unique_id_0__ = 42;
    return false
  } catch (e) {
    if (e instanceof ReferenceError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.13.1-1-6-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  try {
    __ES3_1_test_suite_test_11_13_1_unique_id_0__.x = 42;
  }
  catch (e) {
    if (e instanceof ReferenceError) {
      return true;
    }
  }
 }
module.exports = testcase();
    `
    );

    expect(a).toBeTruthy();
  });

  it('11.13.1-1-7-s', () => {
    const a = run(
      `
function testcase() {
  'use strict';
  try {
    this.x = 42;
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

  it('11.13.1-4-2-s', () => {
    const a = run(
      `
function testcase() {
  function test(o) {
    'use strict';
    try {
      o.NaN = 42;
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

  it('11.13.1-4-3-s', () => {
    const a = run(
      `
function testcase() {
  function test(o) {
    'use strict';
    try {
      o.Infinity = 42;
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

  it('11.13.1-4-4-s', () => {
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
});
