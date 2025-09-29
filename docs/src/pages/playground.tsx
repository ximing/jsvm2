import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import createJSVM2 from '../utils/jsvm2-browser';
import styles from './playground.module.css';

const examples = [
  {
    name: '基础运算',
    code: `// 基础数学运算
const a = 10;
const b = 20;
const sum = a + b;

console.log('a =', a);
console.log('b =', b);
console.log('a + b =', sum);

return sum;`
  },
  {
    name: '简单测试',
    code: `// 简单测试
console.log('Hello, JSVM2!');
console.log('数字:', 42);
console.log('布尔值:', true);
console.log('null:', null);
console.log('undefined:', undefined);

const obj = { name: '测试', value: 123 };
console.log('对象:', obj);

return 'test complete';`
  },
  {
    name: '数组操作',
    code: `// 数组方法演示
const numbers = [1, 2, 3, 4, 5];

console.log('原数组:', numbers);

const doubled = numbers.map(n => n * 2);
console.log('每个元素乘以2:', doubled);

const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log('偶数:', evenNumbers);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('数组求和:', sum);

return { doubled, evenNumbers, sum };`
  },
  {
    name: '函数和闭包',
    code: `// 闭包示例
function createCounter(start) {
  let count = start;

  return function increment() {
    count++;
    console.log('当前计数:', count);
    return count;
  };
}

const counter1 = createCounter(0);
const counter2 = createCounter(10);

console.log('counter1:');
counter1(); // 1
counter1(); // 2

console.log('counter2:');
counter2(); // 11
counter2(); // 12

console.log('再次调用 counter1:');
const result = counter1(); // 3

return result;`
  },
  {
    name: '对象操作',
    code: `// 对象创建和操作
const person = {
  name: '张三',
  age: 25,
  city: '北京',

  introduce() {
    return \`我是\${this.name}，今年\${this.age}岁，来自\${this.city}\`;
  },

  birthday() {
    this.age++;
    console.log(\`\${this.name} 生日快乐！现在\${this.age}岁了\`);
  }
};

console.log('个人信息:', person.introduce());

person.birthday();
person.birthday();

// 对象解构
const { name, age } = person;
console.log(\`解构结果: name=\${name}, age=\${age}\`);

return person;`
  },
  {
    name: '条件和循环',
    code: `// 条件判断和循环
function fibonacci(n) {
  if (n <= 1) return n;

  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

console.log('斐波那契数列前10项:');
const fibSequence = [];

for (let i = 0; i < 10; i++) {
  const fib = fibonacci(i);
  fibSequence.push(fib);
  console.log(\`fibonacci(\${i}) = \${fib}\`);
}

return fibSequence;`
  },
  {
    name: 'ES6+ 特性',
    code: `// 现代 JavaScript 特性演示

// 1. 箭头函数
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => 'Hello, JSVM2!';

console.log('箭头函数:', add(3, 4), square(5), greet());

// 2. 解构赋值
const person = { name: '张三', age: 25, city: '北京' };
const { name, age, city } = person;
console.log(\`解构对象: \${name}, \${age}岁, 来自\${city}\`);

const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log('解构数组:', \`首个: \${first}, 第二个: \${second}, 其余: [\${rest.join(', ')}]\`);

// 3. 扩展运算符
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log('数组合并:', combined);

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log('对象合并:', merged);

// 4. 默认参数
function multiply(a, b = 1) {
  return a * b;
}

console.log('默认参数:', multiply(5), multiply(5, 3));

// 5. 对象方法简写
const calculator = {
  value: 0,

  add(n) {
    this.value += n;
    return this;
  },

  multiply(n) {
    this.value *= n;
    return this;
  },

  get result() {
    return this.value;
  }
};

const result = calculator.add(10).multiply(2).result;
console.log('链式调用结果:', result);

return { combined, merged, result };`
  },
  {
    name: 'let/const 作用域',
    code: `// let 和 const 作用域演示

console.log('=== var vs let 作用域 ===');

// var 的函数作用域
function varExample() {
  console.log('var 示例:');
  if (true) {
    var x = 1;
  }
  console.log('if 块外访问 var x:', x); // 可以访问
}

// let 的块级作用域
function letExample() {
  console.log('let 示例:');
  if (true) {
    let y = 2;
    console.log('if 块内 let y:', y);
  }
  // console.log('if 块外访问 let y:', y); // 这里会报错
  console.log('if 块外无法访问 let y');
}

varExample();
letExample();

console.log('\\n=== const 常量 ===');

const PI = 3.14159;
console.log('PI =', PI);

// PI = 3.14; // 这里会报错

const user = { name: '李四', age: 30 };
console.log('const 对象:', user);

// 可以修改对象属性
user.age = 31;
console.log('修改属性后:', user);

// user = {}; // 这里会报错，不能重新赋值

console.log('\\n=== 循环中的 let ===');

// 使用 let 在循环中
const funcs = [];
for (let i = 0; i < 3; i++) {
  funcs.push(() => i);
}

console.log('let 在循环中的表现:');
funcs.forEach((fn, index) => {
  console.log(\`funcs[\${index}]() = \${fn()}\`);
});

return { PI, user, funcs: funcs.map(fn => fn()) };`
  },
  {
    name: '异常处理',
    code: `// 异常处理和错误类型演示

console.log('=== 基本异常处理 ===');

function divide(a, b) {
  if (b === 0) {
    throw new Error('不能除以零');
  }
  return a / b;
}

try {
  console.log('10 ÷ 2 =', divide(10, 2));
  console.log('10 ÷ 0 =', divide(10, 0)); // 这里会抛出异常
} catch (error) {
  console.log('捕获异常:', error.message);
} finally {
  console.log('finally 块总是执行');
}

console.log('\\n=== 不同类型的错误 ===');

const errorExamples = [
  {
    name: 'TypeError',
    code: () => {
      const num = 42;
      num.push(1); // 数字没有 push 方法
    }
  },
  {
    name: 'ReferenceError',
    code: () => {
      console.log(nonExistentVariable); // 变量不存在
    }
  },
  {
    name: 'SyntaxError',
    code: () => {
      eval('const x = ;'); // 语法错误
    }
  }
];

errorExamples.forEach(({ name, code }) => {
  try {
    code();
  } catch (error) {
    console.log(\`\${name}: \${error.message}\`);
  }
});

console.log('\\n=== 自定义错误类型 ===');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateAge(age) {
  if (typeof age !== 'number') {
    throw new ValidationError('年龄必须是数字');
  }
  if (age < 0 || age > 150) {
    throw new ValidationError('年龄必须在 0-150 之间');
  }
  return true;
}

const testAges = [25, '30', -1, 200];
const results = [];

testAges.forEach(age => {
  try {
    validateAge(age);
    results.push(\`年龄 \${age}: 有效\`);
  } catch (error) {
    results.push(\`年龄 \${age}: \${error.message}\`);
  }
});

console.log('年龄验证结果:');
results.forEach(result => console.log(result));

return {
  division: divide(15, 3),
  validationResults: results
};`
  },
  {
    name: '高级函数特性',
    code: `// 高级函数特性演示

console.log('=== 高阶函数 ===');

// 函数作为参数
function operateOnArray(arr, operation) {
  return arr.map(operation);
}

const numbers = [1, 2, 3, 4, 5];
const doubled = operateOnArray(numbers, x => x * 2);
const squared = operateOnArray(numbers, x => x * x);

console.log('原数组:', numbers);
console.log('每项乘2:', doubled);
console.log('每项平方:', squared);

// 函数作为返回值
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log('\\n=== 函数工厂 ===');
console.log('double(4) =', double(4));
console.log('triple(4) =', triple(4));

console.log('\\n=== 闭包和私有变量 ===');

function createBankAccount(initialBalance) {
  let balance = initialBalance;
  let transactions = [];

  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        transactions.push(\`存入: +\${amount}\`);
        return balance;
      }
      throw new Error('存款金额必须大于0');
    },

    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        transactions.push(\`取出: -\${amount}\`);
        return balance;
      }
      throw new Error('取款金额无效');
    },

    getBalance() {
      return balance;
    },

    getTransactions() {
      return [...transactions]; // 返回副本
    }
  };
}

const account = createBankAccount(100);
console.log('初始余额:', account.getBalance());
console.log('存入50后余额:', account.deposit(50));
console.log('取出30后余额:', account.withdraw(30));
console.log('交易记录:', account.getTransactions());

console.log('\\n=== 函数柯里化 ===');

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log('普通调用:', add(1, 2, 3));
console.log('柯里化调用:', curriedAdd(1)(2)(3));
console.log('部分应用:', curriedAdd(1, 2)(3));

return {
  doubled,
  squared,
  accountBalance: account.getBalance(),
  transactions: account.getTransactions(),
  curriedResult: curriedAdd(1)(2)(3)
};`
  }
];

const MonacoEditor = ({ value, onChange }) => {
  return (
    <BrowserOnly fallback={<div>加载编辑器中...</div>}>
      {() => {
        const Editor = require('@monaco-editor/react').default;
        return (
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={value}
            onChange={onChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              tabSize: 2
            }}
          />
        );
      }}
    </BrowserOnly>
  );
};

export default function Playground(): JSX.Element {
  const [code, setCode] = useState(examples[1].code); // 使用简单测试作为默认
  const [output, setOutput] = useState('');
  const [result, setResult] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput('执行中...');
    setResult('');

    try {
      // 模拟异步执行
      await new Promise(resolve => setTimeout(resolve, 100));

      const jsvm2 = createJSVM2();
      const { result: execResult, output: logs } = jsvm2.run(code);

      setOutput(logs.join('\n') || '(无输出)');
      setResult(
        execResult !== undefined
          ? `返回值: ${typeof execResult === 'object' ? JSON.stringify(execResult, null, 2) : execResult}`
          : '(无返回值)'
      );
    } catch (error) {
      setOutput(`执行错误: ${error.message}`);
      setResult('');
    } finally {
      setIsRunning(false);
    }
  }, [code, isRunning]);

  const loadExample = useCallback((example) => {
    setCode(example.code);
    setOutput('');
    setResult('');
  }, []);

  return (
    <Layout
      title="Playground"
      description="在线体验 JSVM2 JavaScript 解释器">
      <div className={styles.playground}>
        <div className={styles.header}>
          <h1>🚀 JSVM2 Playground</h1>
          <p>在线体验 JavaScript 沙箱解释器，安全执行你的代码</p>
          <div className={styles.notice}>
            <span>💡 这是 JSVM2 的演示版本，支持大部分 JavaScript 特性</span>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.examples}>
            <label>示例代码:</label>
            <select
              onChange={(e) => loadExample(examples[parseInt(e.target.value)])}
              className={styles.exampleSelect}
            >
              {examples.map((example, index) => (
                <option key={index} value={index}>
                  {example.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runCode}
            disabled={isRunning}
            className={styles.runButton}
          >
            {isRunning ? '执行中...' : '▶️ 运行代码'}
          </button>
        </div>

        <div className={styles.container}>
          <div className={styles.editorPanel}>
            <div className={styles.panelHeader}>
              <h3>📝 代码编辑器</h3>
              <span className={styles.hint}>
                支持完整的 JavaScript 语法，包括 ES6+ 特性
              </span>
            </div>
            <div className={styles.editor}>
              <MonacoEditor
                value={code}
                onChange={(value) => setCode(value || '')}
              />
            </div>
          </div>

          <div className={styles.outputPanel}>
            <div className={styles.panelHeader}>
              <h3>📤 执行结果</h3>
            </div>
            <div className={styles.outputSection}>
              <div className={styles.consoleOutput}>
                <h4>控制台输出:</h4>
                <pre className={styles.output}>
                  {output || '点击"运行代码"查看输出'}
                </pre>
              </div>
              {result && (
                <div className={styles.resultOutput}>
                  <h4>执行结果:</h4>
                  <pre className={styles.result}>{result}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>🔒 安全沙箱</h3>
            <p>代码在完全隔离的环境中执行，无法访问宿主环境</p>
          </div>
          <div className={styles.feature}>
            <h3>📚 标准兼容</h3>
            <p>支持完整的 ES5 语法和部分 ES6+ 特性</p>
          </div>
          <div className={styles.feature}>
            <h3>🎯 实时执行</h3>
            <p>即时查看代码执行结果和控制台输出</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}