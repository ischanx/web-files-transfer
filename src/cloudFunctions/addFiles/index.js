
const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({});
// 获取数据库引用
const db = app.database();
const files = db.collection("files");

exports.main = async (event, context) => {
  const { fileList, code } = JSON.parse(event.body);
  if (!Array.isArray(fileList)) {
    return {
      type: 0,
      errMsg: "参数fileList应该是数组类型",
    };
  } else if (fileList.length === 0) {
    return {
      type: 0,
      errMsg: "没有文件",
    };
  }
  const data = [];
  fileList.forEach(file => {
    if (file.fileName.trim() === "") {
      return;
    }
    data.push({
      fileName: file.fileName,
      name: file.name,
      description: file.description,
      code: code,
    });
  });
  const res = await files.add(data);
  return {
    res,
    type: res.ids.length ? 1 : 0,
    errMsg: res.ids.length ? "" : "数据库连接异常",
  };
};
