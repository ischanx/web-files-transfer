const cloudbase = require("@cloudbase/node-sdk");
const app = cloudbase.init({});
// 获取数据库引用

const db = app.database();
const _ = db.command;
const collection = db.collection("collectionCode");

exports.main = async (event, context) => {
  const timestamp = String(Date.now());
  const res = await collection.where({ keepTime: _.lte(timestamp) }).get();
  if (res.data.length) {
    const remove = new Array(res.data.length);
    res.data.forEach((item, index) => {
      remove[index] = collection.where({ code: item.code }).remove();
    });
    const removeRes = await Promise.all(remove);
    return removeRes;
  }
  return {};
};
