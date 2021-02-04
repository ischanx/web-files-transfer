const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({});
// 获取数据库引用
const db = app.database();
const files = db.collection("files");
const codes = db.collection("codes");

exports.main = async (event, context) => {
  const { code, password } = event.queryStringParameters;
  if (code === undefined || password === undefined) {
    return {
      type: 0,
      errMsg: "参数code,password不完整",
    };
  }
  const login = await codes.where({ code, password }).get();
  if (login.data.length === 0) {
    return {
      type: 0,
      errMsg: "收集码或密码不正确",
    };
  }

  const filesRes = await files.where({ code }).get();
  const fileList = filesRes.data;
  return {
    type: 1,
    fileList,
  };
};
