import { UNDEFINED } from './constants';
export interface ISandBox {
  [k: string]: any;
}

// ECMA standar refs: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects
export const CTX: ISandBox = {
  Infinity,
  NaN,
  [UNDEFINED]: undefined,

  isFinite,
  isNaN,
  parseFloat,
  parseInt,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  unescape,

  Object,
  Function,
  Boolean,

  Error,
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError,

  Number,
  Math,
  Date,

  String,
  RegExp,

  Array,

  JSON,
  null: null,
  setInterval,
  setTimeout,
  clearInterval,
  clearTimeout,
  console,
};

if (typeof globalThis !== UNDEFINED) {
  CTX.globalThis = globalThis;
}
// for wx miniprogram
if (typeof eval !== UNDEFINED) {
  CTX.eval = eval;
}

if (typeof Symbol !== UNDEFINED) {
  CTX.Symbol = Symbol;
}

if (typeof Int8Array !== UNDEFINED) {
  CTX.Int8Array = Int8Array;
}

if (typeof Uint8Array !== UNDEFINED) {
  CTX.Uint8Array = Uint8Array;
}

if (typeof Uint8ClampedArray !== UNDEFINED) {
  CTX.Uint8ClampedArray = Uint8ClampedArray;
}

if (typeof Int16Array !== UNDEFINED) {
  CTX.Int16Array = Int16Array;
}

if (typeof Uint16Array !== UNDEFINED) {
  CTX.Uint16Array = Uint16Array;
}

if (typeof Int32Array !== UNDEFINED) {
  CTX.Int32Array = Int32Array;
}

if (typeof Uint32Array !== UNDEFINED) {
  CTX.Uint32Array = Uint32Array;
}

if (typeof Float32Array !== UNDEFINED) {
  CTX.Float32Array = Float32Array;
}

if (typeof Float64Array !== UNDEFINED) {
  CTX.Float64Array = Float64Array;
}

if (typeof Map !== UNDEFINED) {
  CTX.Map = Map;
}
if (typeof Set !== UNDEFINED) {
  CTX.Set = Set;
}
if (typeof WeakMap !== UNDEFINED) {
  CTX.WeakMap = WeakMap;
}
if (typeof WeakSet !== UNDEFINED) {
  CTX.WeakSet = WeakSet;
}

if (typeof ArrayBuffer !== UNDEFINED) {
  CTX.ArrayBuffer = ArrayBuffer;
}

if (typeof SharedArrayBuffer !== UNDEFINED) {
  CTX.SharedArrayBuffer = SharedArrayBuffer;
}

if (typeof Atomics !== UNDEFINED) {
  CTX.Atomics = Atomics;
}

if (typeof DataView !== UNDEFINED) {
  CTX.DataView = DataView;
}

if (typeof Promise !== UNDEFINED) {
  CTX.Promise = Promise;
}

if (typeof Reflect !== UNDEFINED) {
  CTX.Reflect = Reflect;
}

if (typeof Proxy !== UNDEFINED) {
  CTX.Proxy = Proxy;
}

if (typeof Intl !== UNDEFINED) {
  CTX.Intl = Intl;
}

declare const WebAssembly: any;

if (typeof WebAssembly !== UNDEFINED) {
  CTX.WebAssembly = WebAssembly;
}

export class Context {
  constructor(externalContext: ISandBox = {}) {
    const ctx = { ...CTX, ...externalContext };
    Object.keys(ctx).forEach((key) => (this[key] = ctx[key]));
  }
}
