import { run } from '../helper';

describe('rest parameter spec:', () => {
  it('base', () => {
    const func: any = run(
      `
        function fn(...args){
          return "hello " + args.join(",");
        };
        module.exports = fn;
  `
    );
    expect(func('a', 'b')).toEqual('hello a,b');
  });

  it('base 2', () => {
    const func: any = run(
      `
      function fn(...args){
        return args;
      };
      module.exports = fn;
  `
    );
    expect(func('a', 'b')).toEqual(['a', 'b']);
  });
});
