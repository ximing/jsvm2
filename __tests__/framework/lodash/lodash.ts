import * as fs from 'fs';
import * as path from 'path';
import { run } from '../../helper';

const lodashCode = fs.readFileSync(
  path.join(__dirname, '../../../framework/lodash/lodash.out.js'),
  'utf-8'
);
export const _ = run(lodashCode, { self: global, global, console, require });
