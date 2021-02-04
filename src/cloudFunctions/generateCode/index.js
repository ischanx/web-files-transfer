const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({});
// 获取数据库引用
const db = app.database();
const codes = db.collection("codes");
// 随机生成收集码
const generateCode = (codeLength = 6) => {
  const char = "qazwsQW78ERTYUIPxedcrASDF456GHJKLvtgbyhjnujmiZXCkVBNMp239";
  const { length } = char;
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    const index = parseInt(Math.random() * length, 10);
    code += char[index];
  }
  return code;
};

exports.main = async (event, context) => {
  const {
    name,
    description,
    deadline,
    retention,
    password,
    type,
  } = JSON.parse(event.body);
  if (deadline === undefined || retention === undefined || password === undefined || type === undefined) {
    return {
      type: 0,
      errMsg: "参数不完整",
    };
  }
  let code;
  while (true) {
    code = generateCode();
    const res = await codes.where({ code }).get();
    if (res.data) {
      console.log(res);
      break;
    }
  }

  const newCode = {
    code,
    type,
    name,
    description,
    deadline,
    retention,
    password,
  };

  const res = await codes.add(newCode);
  if (res.id) {
    return {
      type: 1,
      code,
      errMsg: "",
    };
  }
};
