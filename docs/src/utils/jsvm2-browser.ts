// 简化版的 JSVM2 浏览器实现
// 这是一个演示版本，实际项目中应该使用完整的 JSVM2 库

interface ISandBox {
  [k: string]: any;
}

export function createJSVM2() {
  return {
    run: (code: string, customContext: ISandBox = {}) => {
      const output: string[] = [];

      // 创建安全的执行环境
      const context = {
        // 基本值
        undefined: undefined,
        null: null,
        Infinity: Infinity,
        NaN: NaN,
        true: true,
        false: false,

        // 全局函数
        parseInt: parseInt,
        parseFloat: parseFloat,
        isNaN: isNaN,
        isFinite: isFinite,
        encodeURIComponent: encodeURIComponent,
        decodeURIComponent: decodeURIComponent,

        // 构造函数
        Object: Object,
        Array: Array,
        String: String,
        Number: Number,
        Boolean: Boolean,
        Date: Date,
        Math: Math,
        JSON: JSON,
        RegExp: RegExp,

        // 错误对象
        Error: Error,
        TypeError: TypeError,
        ReferenceError: ReferenceError,
        SyntaxError: SyntaxError,
        RangeError: RangeError,

        // console 实现
        console: {
          log: (...args: any[]) => {
            const formatted = args.map(arg => {
              if (arg === null) return 'null';
              if (arg === undefined) return 'undefined';
              if (typeof arg === 'string') return arg;
              if (typeof arg === 'number' || typeof arg === 'boolean') return String(arg);
              if (typeof arg === 'function') return '[Function]';
              if (typeof arg === 'object') {
                try {
                  return JSON.stringify(arg, null, 2);
                } catch (e) {
                  return '[Object]';
                }
              }
              return String(arg);
            }).join(' ');

            output.push(formatted);
            return formatted;
          }
        },

        // 合并自定义上下文
        ...customContext
      };

      try {
        // 使用 with 语句创建上下文（在非严格模式下）
        const executor = new Function('context', 'output', `
          with (context) {
            let __result__;
            try {
              __result__ = (function() {
                ${code}
              })();
            } catch (e) {
              console.log('执行错误: ' + e.message);
              throw e;
            }
            return __result__;
          }
        `);

        const result = executor(context, output);

        return {
          result: result,
          output: [...output]
        };

      } catch (error) {
        // 如果是语法错误，尝试作为表达式执行
        if (error.name === 'SyntaxError' || error.message.includes('Unexpected token')) {
          try {
            const expressionExecutor = new Function('context', 'output', `
              with (context) {
                return (${code});
              }
            `);

            const result = expressionExecutor(context, output);
            return {
              result: result,
              output: [...output]
            };
          } catch (expressionError) {
            output.push(`语法错误: ${error.message}`);
            return {
              result: undefined,
              output: [...output]
            };
          }
        }

        output.push(`执行错误: ${error.message}`);
        return {
          result: undefined,
          output: [...output]
        };
      }
    },

    createContext: (sandbox: ISandBox = {}) => {
      return sandbox;
    }
  };
}

export default createJSVM2;