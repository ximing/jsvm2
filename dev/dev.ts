import { runInContext, createContext } from '../src/vm';

const code = require('fs').readFileSync(__dirname + '/case1.js', 'utf-8');
const node = runInContext(
  code,
  createContext({
    regeneratorRuntime: require('./regenerator-runtime/runtime.js'),
  })
);
console.log(node.getTplFromTT('test', '1.2.3'));
// describe('literal spec:', () => {
//   acorn.parse;
// });
