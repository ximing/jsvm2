---
sidebar_position: 1
---

# ES5 语法支持

JSVM2 完整支持 ECMAScript 5 规范中定义的所有语法特性。

## 支持的语法特性

### ✅ 基本语法

#### 字面量
- **字符串字面量** - `"hello"`, `'world'`
- **数字字面量** - `123`, `3.14`, `0xFF`
- **布尔字面量** - `true`, `false`
- **空值字面量** - `null`
- **正则表达式字面量** - `/pattern/flags`

```javascript
// 示例
const str = "Hello, World!";
const num = 42;
const bool = true;
const empty = null;
const regex = /\d+/g;
```

#### 标识符
- **变量名** - 支持 Unicode 字符
- **属性访问** - 点号和方括号语法

```javascript
const 变量名 = "支持中文变量名";
const obj = { prop: "value" };
console.log(obj.prop);
console.log(obj["prop"]);
```

### ✅ 变量声明

#### var 声明
- 函数作用域
- 变量提升
- 重复声明

```javascript
function example() {
  var x = 1;
  if (true) {
    var x = 2; // 同一个变量
    console.log(x); // 2
  }
  console.log(x); // 2
}
```

### ✅ 函数

#### 函数声明
```javascript
function add(a, b) {
  return a + b;
}
```

#### 函数表达式
```javascript
const multiply = function(a, b) {
  return a * b;
};

// 命名函数表达式
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};
```

#### 立即执行函数表达式 (IIFE)
```javascript
(function() {
  console.log("立即执行");
})();

(function(global) {
  // 模块模式
})(this);
```

### ✅ 对象和数组

#### 对象字面量
```javascript
const person = {
  name: "张三",
  age: 30,
  greet: function() {
    return "Hello, " + this.name;
  }
};

// 属性访问
console.log(person.name);
console.log(person["age"]);
```

#### 数组字面量
```javascript
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "hello", true, null, { key: "value" }];

// 数组方法
numbers.push(6);
numbers.pop();
numbers.slice(1, 3);
```

### ✅ 控制流语句

#### 条件语句
```javascript
// if-else
if (condition) {
  // 代码
} else if (otherCondition) {
  // 代码
} else {
  // 代码
}

// 三元运算符
const result = condition ? value1 : value2;

// switch
switch (value) {
  case 1:
    console.log("One");
    break;
  case 2:
    console.log("Two");
    break;
  default:
    console.log("Other");
}
```

#### 循环语句
```javascript
// for 循环
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// while 循环
let i = 0;
while (i < 10) {
  console.log(i);
  i++;
}

// do-while 循环
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 10);

// for-in 循环
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
  console.log(key, obj[key]);
}
```

### ✅ 异常处理

```javascript
try {
  // 可能抛出异常的代码
  throw new Error("自定义错误");
} catch (error) {
  console.log("捕获异常:", error.message);
} finally {
  console.log("总是执行");
}
```

### ✅ 表达式和运算符

#### 算术运算符
```javascript
const a = 10;
const b = 3;

console.log(a + b); // 13 (加法)
console.log(a - b); // 7  (减法)
console.log(a * b); // 30 (乘法)
console.log(a / b); // 3.333... (除法)
console.log(a % b); // 1  (取余)
```

#### 比较运算符
```javascript
console.log(5 > 3);   // true
console.log(5 < 3);   // false
console.log(5 >= 5);  // true
console.log(5 <= 3);  // false
console.log(5 == "5"); // true (类型转换)
console.log(5 === "5"); // false (严格相等)
console.log(5 != "6");  // true
console.log(5 !== "5"); // true
```

#### 逻辑运算符
```javascript
const x = true;
const y = false;

console.log(x && y); // false (逻辑与)
console.log(x || y); // true  (逻辑或)
console.log(!x);     // false (逻辑非)
```

#### 位运算符
```javascript
const a = 5;  // 101 (二进制)
const b = 3;  // 011 (二进制)

console.log(a & b);  // 1 (按位与)
console.log(a | b);  // 7 (按位或)
console.log(a ^ b);  // 6 (按位异或)
console.log(~a);     // -6 (按位非)
console.log(a << 1); // 10 (左移)
console.log(a >> 1); // 2  (右移)
```

#### 赋值运算符
```javascript
let x = 10;
x += 5;  // x = x + 5
x -= 3;  // x = x - 3
x *= 2;  // x = x * 2
x /= 4;  // x = x / 4
x %= 3;  // x = x % 3
```

#### 一元运算符
```javascript
let x = 5;
console.log(+x);    // 5  (一元加)
console.log(-x);    // -5 (一元减)
console.log(++x);   // 6  (前置递增)
console.log(x++);   // 6  (后置递增，x变为7)
console.log(--x);   // 6  (前置递减)
console.log(x--);   // 6  (后置递减，x变为5)

console.log(typeof x); // "number"
console.log(delete obj.prop); // true/false
```

### ✅ 高级特性

#### 闭包
```javascript
function createCounter(start) {
  let count = start;
  return function() {
    return ++count;
  };
}

const counter = createCounter(10);
console.log(counter()); // 11
console.log(counter()); // 12
```

#### this 绑定
```javascript
const obj = {
  name: "对象",
  method: function() {
    console.log(this.name);
  }
};

obj.method(); // "对象"

const func = obj.method;
func(); // undefined (严格模式下)
```

#### 原型链
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return "Hello, " + this.name;
};

const person = new Person("张三");
console.log(person.greet()); // "Hello, 张三"
```

### ✅ 内置对象方法

#### Array 方法
```javascript
const arr = [1, 2, 3, 4, 5];

// 变异方法
arr.push(6);           // 添加到末尾
arr.pop();             // 移除末尾元素
arr.shift();           // 移除首个元素
arr.unshift(0);        // 添加到开头
arr.splice(1, 2, 'a'); // 删除并插入

// 非变异方法
const doubled = arr.map(x => x * 2);
const filtered = arr.filter(x => x > 2);
const sum = arr.reduce((acc, x) => acc + x, 0);
```

#### Object 方法
```javascript
const obj = { a: 1, b: 2 };

console.log(Object.keys(obj));        // ["a", "b"]
console.log(Object.values(obj));      // [1, 2] (ES2017+)
console.log(Object.hasOwnProperty.call(obj, 'a')); // true
```

#### String 方法
```javascript
const str = "Hello, World!";

console.log(str.length);           // 13
console.log(str.charAt(0));        // "H"
console.log(str.indexOf("World")); // 7
console.log(str.slice(0, 5));      // "Hello"
console.log(str.split(", "));      // ["Hello", "World!"]
```

## 严格模式

JSVM2 始终在严格模式下运行，这意味着：

- 未声明的变量会抛出错误
- 重复的参数名会抛出错误
- `this` 在全局作用域中为 `undefined`
- 禁用 `with` 语句
- 禁用八进制字面量

```javascript
// 这些在 JSVM2 中会抛出错误
undeclaredVariable = 5; // ReferenceError
function func(a, a) {}  // SyntaxError
```