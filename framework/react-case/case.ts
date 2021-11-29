import * as fs from 'fs';
import * as path from 'path';

import { createContext, runInContext } from '../../src/vm';
import { parse } from '@babel/parser';

const ast = parse(fs.readFileSync(path.join(__dirname, './dist/out.js'), 'utf-8'), {
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
});
const sandbox: any = createContext({});
const module1 = runInContext(ast, sandbox);
console.log(module1);
