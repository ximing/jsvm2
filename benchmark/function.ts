import * as Benchmark from 'benchmark';

import { createContext, runInContext } from '../src/vm';
import { parse } from '@babel/parser';

const ast = parse(
  `module.exports = function(a){
    a++;
    a++;
    var j = 0;
    for (let i = 0, l = 20; i < l; i++) {
      while (j++ < 10) {
        a = i * j;
      }
    }
    return a * 10;
  }
  `,
  {
    sourceType: 'module',
    plugins: [
      'asyncGenerators',
      'classProperties',
      'decorators-legacy',
      'doExpressions',
      'exportDefaultFrom',
      'flow',
      'objectRestSpread',
    ],
  }
);
const sandbox: any = createContext({});

const run = function (runInContext1: any = runInContext(ast, sandbox)) {
  return runInContext1;
};
const run1 = run();
const run2 = function (a) {
  a++;
  a++;
  var j = 0;
  for (let i = 0, l = 20; i < l; i++) {
    while (j++ < 10) {
      a = i * j;
    }
  }
  return a * 10;
};

let suite = new Benchmark.Suite();

suite
  .add('xm-jsvm', function () {
    run1(1);
  })
  .add('native', function () {
    run2(1);
  })
  // add listeners
  .on('cycle', function (event) {
    console.log(String(event.target));
  })
  .on('complete', function () {
    // console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  })
  // run async
  .run({ async: true });
