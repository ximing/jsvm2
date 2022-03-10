'use strict';
var popupRender = {
  b: 1,
  test() {
    return this.b;
  },
  p: {
    c() {
      return {
        b: 1,
        test() {
          return this.b;
        },
      };
    },
  },
};
var _PopLogic = /*#__PURE__*/ (function () {
  function _PopLogic() {}
  var _proto12 = _PopLogic.prototype;
  _proto12.useRenderFunc = function useRenderFunc(funcName) {
    var _this$popupController;
    return (_this$popupController = popupRender)[funcName].apply(_this$popupController, []);
  };
  return _PopLogic;
})();
console.log(new _PopLogic().useRenderFunc('test'));
