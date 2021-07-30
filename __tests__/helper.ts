import { createContext, runInContext } from '../src/vm';

export const run = function (code, ctx = {}) {
  const sandbox: any = createContext(ctx);
  return runInContext(code, sandbox);
};
