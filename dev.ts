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
var a = 0;
for(let i = 0; i < 5; i++){
   console.log(i)
   if(i == 2) continue;
   a++;
}
module.exports = a;
`;

const node = runInContext(code, createContext());
console.log(node);
// describe('literal spec:', () => {
//   acorn.parse;
// });
