'use strict';
function testcase() {
  var o = JSON;
  var i = 0;
  for (var p in o) {
    i++;
  }

  if (i === 0) {
    return true;
  }
}console.log(testcase());
// module.exports = testcase();
