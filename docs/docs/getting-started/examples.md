---
sidebar_position: 3
---

# 使用示例

本节提供了 JSVM2 在各种实际场景中的使用示例。

## 在线代码执行器

创建一个安全的在线代码执行环境：

```javascript
import { createContext, runInContext } from 'jsvm2';

class CodeExecutor {
  constructor() {
    // 创建受限的沙箱环境
    this.sandbox = createContext({
      // 提供基本的全局对象
      console: {
        log: (...args) => this.output.push(['log', ...args]),
        error: (...args) => this.output.push(['error', ...args]),
        warn: (...args) => this.output.push(['warn', ...args])
      },
      // 提供部分 Math 对象
      Math: Math,
      // 提供部分 Array 和 Object 方法
      Array: Array,
      Object: Object
    });
    this.output = [];
  }

  execute(code) {
    this.output = [];
    try {
      const result = runInContext(code, this.sandbox);
      return {
        success: true,
        result,
        output: this.output
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        output: this.output
      };
    }
  }
}

// 使用示例
const executor = new CodeExecutor();

const result1 = executor.execute(`
  console.log('Hello, World!');
  const numbers = [1, 2, 3, 4, 5];
  numbers.filter(n => n % 2 === 0).map(n => n * 2);
`);

console.log(result1);
// {
//   success: true,
//   result: [4, 8],
//   output: [['log', 'Hello, World!']]
// }
```

## 配置引擎

使用 JSVM2 执行动态配置脚本：

```javascript
import { createContext, runInContext } from 'jsvm2';

class ConfigEngine {
  constructor(baseConfig = {}) {
    this.baseConfig = baseConfig;
    this.sandbox = createContext({
      // 提供配置辅助函数
      env: (key, defaultValue) => process.env[key] || defaultValue,
      merge: (obj1, obj2) => ({ ...obj1, ...obj2 }),
      // 提供基础数据
      ...baseConfig
    });
  }

  evaluateConfig(configScript) {
    return runInContext(configScript, this.sandbox);
  }
}

// 使用示例
const engine = new ConfigEngine({
  appName: 'MyApp',
  version: '1.0.0'
});

const config = engine.evaluateConfig(`
  const isDev = env('NODE_ENV', 'development') === 'development';

  merge({
    name: appName,
    version: version,
    debug: isDev,
    port: isDev ? 3000 : 8080,
    database: {
      host: env('DB_HOST', 'localhost'),
      port: parseInt(env('DB_PORT', '5432')),
      name: env('DB_NAME', appName.toLowerCase())
    }
  }, {
    features: {
      logging: true,
      monitoring: !isDev
    }
  });
`);

console.log(config);
```

## 插件系统

创建一个安全的插件执行环境：

```javascript
import { createContext, runInContext } from 'jsvm2';

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }

  // 注册插件
  registerPlugin(name, pluginCode) {
    const sandbox = createContext({
      // 插件 API
      registerHook: (hookName, callback) => {
        if (!this.hooks.has(hookName)) {
          this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName).push(callback);
      },

      // 工具函数
      utils: {
        format: (template, ...args) => {
          return template.replace(/{(\d+)}/g, (match, number) => {
            return typeof args[number] !== 'undefined' ? args[number] : match;
          });
        },

        debounce: (func, wait) => {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        }
      }
    });

    try {
      const plugin = runInContext(pluginCode, sandbox);
      this.plugins.set(name, plugin);
      console.log(`插件 ${name} 注册成功`);
    } catch (error) {
      console.error(`插件 ${name} 注册失败:`, error.message);
    }
  }

  // 执行钩子
  async executeHook(hookName, ...args) {
    const hooks = this.hooks.get(hookName) || [];
    const results = [];

    for (const hook of hooks) {
      try {
        const result = await hook(...args);
        results.push(result);
      } catch (error) {
        console.error(`钩子 ${hookName} 执行失败:`, error.message);
      }
    }

    return results;
  }
}

// 使用示例
const pluginManager = new PluginManager();

// 注册一个日志插件
pluginManager.registerPlugin('logger', `
  registerHook('beforeSave', (data) => {
    console.log('准备保存数据:', data);
    return { timestamp: Date.now(), ...data };
  });

  registerHook('afterSave', (result) => {
    console.log('数据保存完成:', result);
  });

  // 导出插件信息
  ({
    name: 'Logger Plugin',
    version: '1.0.0',
    description: '提供日志记录功能'
  });
`);

// 执行钩子
async function saveData(data) {
  const processedData = await pluginManager.executeHook('beforeSave', data);
  const result = { id: Math.random(), ...processedData[0] };
  await pluginManager.executeHook('afterSave', result);
  return result;
}

saveData({ name: 'test', value: 42 });
```

## 表达式计算器

创建一个安全的数学表达式计算器：

```javascript
import { createContext, runInContext } from 'jsvm2';

class ExpressionCalculator {
  constructor() {
    this.sandbox = createContext({
      // 数学函数
      Math: Math,

      // 自定义函数
      sum: (...args) => args.reduce((a, b) => a + b, 0),
      avg: (...args) => args.reduce((a, b) => a + b, 0) / args.length,

      // 常量
      PI: Math.PI,
      E: Math.E
    });
  }

  calculate(expression) {
    try {
      // 验证表达式安全性（简单检查）
      if (this.containsUnsafeOperations(expression)) {
        throw new Error('表达式包含不安全的操作');
      }

      const result = runInContext(expression, this.sandbox);

      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('表达式结果必须是有效数字');
      }

      return result;
    } catch (error) {
      throw new Error(`计算错误: ${error.message}`);
    }
  }

  containsUnsafeOperations(expression) {
    const unsafePatterns = [
      /function\s*\(/,
      /=>/,
      /eval\s*\(/,
      /constructor/,
      /prototype/,
      /__proto__/
    ];

    return unsafePatterns.some(pattern => pattern.test(expression));
  }
}

// 使用示例
const calculator = new ExpressionCalculator();

console.log(calculator.calculate('2 + 3 * 4')); // 14
console.log(calculator.calculate('Math.sqrt(16) + Math.pow(2, 3)')); // 12
console.log(calculator.calculate('sum(1, 2, 3, 4, 5)')); // 15
console.log(calculator.calculate('avg(10, 20, 30) * 2')); // 40

try {
  calculator.calculate('function() { return 42; }()');
} catch (error) {
  console.log(error.message); // "表达式包含不安全的操作"
}
```

## 模板引擎

使用 JSVM2 创建一个简单的模板引擎：

```javascript
import { createContext, runInContext } from 'jsvm2';

class TemplateEngine {
  constructor() {
    this.sandbox = createContext({
      // 模板辅助函数
      formatDate: (date) => new Date(date).toLocaleDateString('zh-CN'),
      formatNumber: (num) => num.toLocaleString('zh-CN'),
      escapeHtml: (str) => str
        .replace(/&/g, '&aemp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;'),

      // 条件渲染
      if: (condition, trueValue, falseValue) => condition ? trueValue : falseValue
    });
  }

  render(template, data) {
    // 创建带数据的沙箱
    const templateSandbox = createContext({
      ...this.sandbox,
      ...data
    });

    try {
      // 将模板转换为可执行代码
      const code = this.compileTemplate(template);
      return runInContext(code, templateSandbox);
    } catch (error) {
      throw new Error(`模板渲染错误: ${error.message}`);
    }
  }

  compileTemplate(template) {
    // 简单的模板编译（实际项目中应该更复杂）
    return `
      const parts = [];
      ${template.replace(/\{\{(.+?)\}\}/g, (match, expression) => {
        return `parts.push(${expression.trim()});`;
      })}
      parts.join('');
    `;
  }
}

// 使用示例
const templateEngine = new TemplateEngine();

const template = `
{{name}} 的个人信息：
- 年龄：{{age}} 岁
- 余额：¥{{formatNumber(balance)}}
- 注册时间：{{formatDate(registerDate)}}
- 状态：{{if(isVip, 'VIP会员', '普通用户')}}
`;

const data = {
  name: '张三',
  age: 25,
  balance: 12345.67,
  registerDate: '2023-01-15',
  isVip: true
};

const result = templateEngine.render(template, data);
console.log(result);
// 张三 的个人信息：
// - 年龄：25 岁
// - 余额：¥12,345.67
// - 注册时间：2023/1/15
// - 状态：VIP会员
```

## 单元测试辅助

使用 JSVM2 创建隔离的测试环境：

```javascript
import { createContext, runInContext } from 'jsvm2';

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  createTestSandbox() {
    return createContext({
      // 断言函数
      assert: {
        equal: (actual, expected, message) => {
          if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
          }
        },

        deepEqual: (actual, expected, message) => {
          if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(message || `Deep equality failed`);
          }
        },

        throws: (fn, message) => {
          try {
            fn();
            throw new Error(message || 'Expected function to throw');
          } catch (error) {
            // 预期的错误
          }
        }
      },

      // 测试工具
      spy: (fn) => {
        const calls = [];
        const spy = function(...args) {
          calls.push(args);
          return fn ? fn.apply(this, args) : undefined;
        };
        spy.calls = calls;
        spy.callCount = () => calls.length;
        return spy;
      }
    });
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    this.results = [];

    for (const test of this.tests) {
      const sandbox = this.createTestSandbox();
      const startTime = Date.now();

      try {
        await runInContext(test.testFn.toString() + '()', sandbox);
        this.results.push({
          name: test.name,
          status: 'passed',
          duration: Date.now() - startTime
        });
      } catch (error) {
        this.results.push({
          name: test.name,
          status: 'failed',
          error: error.message,
          duration: Date.now() - startTime
        });
      }
    }

    return this.results;
  }

  report() {
    const passed = this.results.filter(r => r.status === 'passed').length;
    const failed = this.results.filter(r => r.status === 'failed').length;

    console.log(`\n测试报告:`);
    console.log(`通过: ${passed}, 失败: ${failed}, 总计: ${this.results.length}`);

    this.results.forEach(result => {
      const status = result.status === 'passed' ? '✅' : '❌';
      console.log(`${status} ${result.name} (${result.duration}ms)`);
      if (result.error) {
        console.log(`   错误: ${result.error}`);
      }
    });
  }
}

// 使用示例
const runner = new TestRunner();

runner.test('基本数学运算', function() {
  assert.equal(2 + 2, 4, '2 + 2 应该等于 4');
  assert.equal(3 * 4, 12, '3 * 4 应该等于 12');
});

runner.test('数组操作', function() {
  const arr = [1, 2, 3];
  const doubled = arr.map(x => x * 2);
  assert.deepEqual(doubled, [2, 4, 6], '数组元素应该都乘以2');
});

runner.test('间谍函数', function() {
  const mockFn = spy();
  mockFn('hello', 'world');
  mockFn('foo');

  assert.equal(mockFn.callCount(), 2, '函数应该被调用2次');
  assert.deepEqual(mockFn.calls[0], ['hello', 'world'], '第一次调用参数正确');
});

// 运行测试
runner.run().then(() => {
  runner.report();
});
```

这些示例展示了 JSVM2 在不同场景下的应用方式，从简单的代码执行到复杂的系统集成，都能提供安全可靠的沙箱环境。