import { run } from '../helper';

describe('esbuild spec:', () => {
  it('module', () => {
    const res = run(
      `
    var __defProp = Object.defineProperty;
    var __markAsModule = (target) => __defProp(target, '__esModule', { value: true });
    var __export = (target, all) => {
        __markAsModule(target);
        for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
    };
    // src/b.ts
    __export(exports, {
        abc: () => abc,
        d: () => d,
    });
    var abc = {};
    var d = function () { return this;};
    `,
      {},
      true,
      true
    );
    expect(res.abc).toEqual({});
    expect(res.d().abc).toEqual(res.abc);

    const res1 = run(
      `
      var __create = Object.create;
      var __defProp = Object.defineProperty;
      var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
      var __getOwnPropNames = Object.getOwnPropertyNames;
      var __getProtoOf = Object.getPrototypeOf;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __markAsModule = (target) => __defProp(target, '__esModule', { value: true });
      var __reExport = (target, module2, desc) => {
        if ((module2 && typeof module2 === 'object') || typeof module2 === 'function') {
            for (let key of __getOwnPropNames(module2))
                if (!__hasOwnProp.call(target, key) && key !== 'default')
                    __defProp(target, key, {
                        get: () => module2[key],
                        enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable,
                    });
        }
        return target;
    };
    var __toModule = (module2) => {
      return __reExport(
          __markAsModule(
              __defProp(
                  module2 != null ? __create(__getProtoOf(module2)) : {},
                  'default',
                  module2 && module2.__esModule && 'default' in module2
                      ? { get: () => module2.default, enumerable: true }
                      : { value: module2, enumerable: true }
              )
          ),
          module2
      );
    };
    module.exports = __toModule(m)
    `,
      { m: res },
      true,
      true
    );
    expect(res1.abc).toEqual({});
    expect(res1.d().abc).toEqual(res.abc);
  });

  it('enum', () => {
    const res = run(`
    var __defProp = Object.defineProperty;
    var __markAsModule = function __markAsModule(target) {
      return __defProp(target, "__esModule", {
        value: true
      });
    };
    var __export = function __export(target, all) {
      var name;
  
      __markAsModule(target);
  
      for (name in all) {
        __defProp(target, name, {
          get: all[name],
          enumerable: true
        });
      }
    }; // projects/grocery-c-mp-exhibition/src/components/redPacketBar/interface.ts
  
  
    __export(exports, {
      ActivityName: function ActivityName() {
        return _ActivityName;
      },
      Sequence: function Sequence() {
        return _Sequence;
      },
      UserBehavior: function UserBehavior() {
        return _UserBehavior;
      }
    });
  
    var _Sequence;
  
    (function (Sequence2) {
      Sequence2["LEFT_TEXT"] = "leftText";
      Sequence2["ALL_TIPS"] = "tipsInfoVO";
      Sequence2["MONTH_CARD"] = "memberEntranceInfoVO";
      Sequence2["WALK_REWARD"] = "footStepRewardVO";
      Sequence2["MT_PAY"] = "payAccess";
      Sequence2["REFUND"] = "refundBannerVO";
      Sequence2["MAICAI_QIAN"] = "groceryShoppingDisplayResponse";
      Sequence2["CASH_BACK"] = "orderCashBackActivityResponse";
      Sequence2["MULTI_ORDER"] = "multiOrder";
    })(_Sequence || (_Sequence = {}));
  
    var _ActivityName;
  
    (function (ActivityName2) {
      ActivityName2["A_ACTIVITIES"] = "yingxiaowanfa";
      ActivityName2["A_TIPS"] = "youhuiquan";
      ActivityName2["A_WALK_REWARD"] = "zouluzhuanqian";
      ActivityName2["A_MONTH_CARD"] = "yueka";
      ActivityName2["A_MT_PAY"] = "meituanzhifu";
    })(_ActivityName || (_ActivityName = {}));
  
    var _UserBehavior;
  
    (function (UserBehavior2) {
      UserBehavior2[UserBehavior2["UNCLICK"] = 1] = "UNCLICK";
      UserBehavior2[UserBehavior2["CONTENT"] = 2] = "CONTENT";
      UserBehavior2[UserBehavior2["CLOSE"] = 3] = "CLOSE";
    })(_UserBehavior || (_UserBehavior = {}));
`);
    expect(res.Sequence.MONTH_CARD).toEqual('memberEntranceInfoVO');
  });
});
