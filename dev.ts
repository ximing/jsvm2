import { runInContext, createContext } from './src/vm';

const code = `
// let a = 90;
// const b = "nnamdi";
// const c = a*5;
// var obj = {
//     a: 1,
//     a: 2,
//   };
// console.log(c)
// module.exports = obj;
// var a = 0;
// for(let i = 0; i < 5; i++){
//    console.log(i)
//    if(i == 2) continue;
//    a++;
// }
// module.exports = a;
'use strict';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function post(opt) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: opt.url,
      data: opt.data,
      method: 'POST',
      dataType: 'json',
      success: resolve,
      fail: reject
    });
  });
}

function get(url) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: 'GET',
      dataType: 'json',
      success: resolve,
      fail: reject
    });
  });
}

function getTplFromTT(_x, _x2) {
  return _getTplFromTT.apply(this, arguments);
}

function _getTplFromTT() {
  _getTplFromTT = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(key, version) {
    var res, bundle, _yield$get, data;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return post({
              url: "https://dd.meituan.com/config/theseus/checkList?bundleNames=".concat(key),
              data: {
                // appVersion: '1100100200',
                appVersionName: version,
                platform: 'Android',
                app: 'meituanyouxuan_app',
                sdkVersion: '1.5.0',
                bundles: []
              }
            });

          case 2:
            res = _context.sent;
            bundle = res.data.bundles.find(function (item) {
              return item.bundleName === key;
            });

            if (!bundle) {
              _context.next = 11;
              break;
            }

            _context.next = 7;
            return get(bundle.url);

          case 7:
            _yield$get = _context.sent;
            data = _yield$get.data;

            if (!data.ast) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", data);

          case 11:
            return _context.abrupt("return", null);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getTplFromTT.apply(this, arguments);
}

function checkList(_x3) {
  return _checkList.apply(this, arguments);
}

function _checkList() {
  _checkList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(key) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            wx.request({
              url: 'https://dd.meituan.com/config/theseus/checkList'
            });

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _checkList.apply(this, arguments);
}

exports.checkList = checkList;
exports.getTplFromTT = getTplFromTT;
//# sourceMappingURL=loader-ec2464c2.js.map

`;

const node = runInContext(code, createContext());
console.log(node.getTplFromTT('test','1.2.3'));
// describe('literal spec:', () => {
//   acorn.parse;
// });
