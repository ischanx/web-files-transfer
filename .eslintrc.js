module.exports = {
  env: {
    browser: true,
  },
  extends: [
    "plugin:vue/essential",
    "standard",
  ],
  parserOptions: {
    ecmaVersion: 7,
    sourceType: "module",
    parser: "babel-eslint",

  },
  plugins: [
    "vue",
  ],
  rules: {
    "linebreak-style": ["error", "windows"], // 使用windows地换行不用linux的
    eqeqeq: "error", // 强制全等( === 和 !==)
    "arrow-parens": ["error", "as-needed"], // 箭头函数的参数可以不使用圆括号
    indent: ["error", 2, { SwitchCase: 1 }], // 缩进风格
    "no-unused-vars": "warn", // 禁止出现未使用过的变量
    "no-redeclare": "error", // 禁止多次声明同一变量
    "no-use-before-define": "error", // 禁止在变量定义之前使用它们
    "no-unused-expressions": "off", // 允许使用未使用过的表达式，以此来支持a && a()的代码形式
    "no-empty": "error", // 使用空块语句警告
    "no-empty-function": "off", // 允许使用空函数
    "max-len": ["warn", { code: 200 }], // 一行200
    quotes: ["error", "double"], // 使用双引号
    "operator-linebreak": ["error", "before"],
    "prefer-destructuring": ["warn"], // 优先采用解构
    "no-param-reassign": ["off"], // 禁止对参数修改
    "no-useless-escape": ["off"], // 禁用不必要的转义
    "no-nested-ternary": ["error"], // 禁用嵌套三目运算符
    "import/no-cycle": ["off"], // 禁止多层import报错
    "no-shadow": ["error"], // 同名变量嵌套警告
    "comma-dangle": ["error", "always-multiline"], // 多行必须逗号结尾
    "vue/experimental-script-setup-vars": ["off"],
  },
}
