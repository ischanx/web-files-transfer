
import config from "./config";
const COS = require("cos-js-sdk-v5");
const { bucket, region, baseURL, SecretId, SecretKey } = config;
const cos = new COS({
  SecretId,
  SecretKey,
});

// fetch方法简单封装
const get = async (url, params) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let str = "?";
  Object.keys(params).forEach((key, index) => {
    if (!index) { str += key + "=" + params[key]; } else str += "&" + key + "=" + params[key];
  });
  const res = await fetch(baseURL + url + str, options);
  return res.json();
};

const post = async (url, params) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  };
  const res = await fetch(baseURL + url, options);
  return res.json();
};

/**
 * @description 生成码
 */
const generateCode = async params => {
  return post("/generateCode", params);
};

/**
 * @description 添加文件和码信息到数据库
 */
const addFiles = async params => {
  return post("/addFiles", params);
};

/**
 * @description 根据码获取文件
 */
const getFiles = async params => {
  return get("/getFilesByCode", params);
};

/**
 * @description 获取文件真实地址
 */
const downloadFiles = async fileList => {
  const urls = [];
  fileList.forEach(file => {
    const url = cos.getObjectUrl({
      Bucket: bucket,
      Region: region,
      Key: file.fileName,
    });
    urls.push(url);
  });
  return urls;
};
/**
 * @description 上传文件到COS
 */
const uploadFiles = async (code, fileList, callback) => {
  const files = [];
  const timestamp = Date.now();
  fileList.forEach(file => {
    files.push({
      Bucket: bucket,
      Region: region,
      Key: `${code}/${timestamp}/${file.name}`,
      Body: file.raw,
    });
  });
  return new Promise((resolve, reject) => {
    const totalNum = fileList.length;
    let finishNum = 0;
    let speed = 0;
    let percent = 0;
    cos.uploadFiles({
      files: files,
      SliceSize: 1024 * 1024,
      onProgress: function (info, a, options) {
        percent = parseInt(info.percent * 10000) / 100;
        speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
        // console.log("进度：" + percent + "%; 速度：" + speed + "Mb/s;")
        // eslint-disable-next-line node/no-callback-literal
        callback({
          percent: (100 * finishNum + percent) / totalNum,
          speed,
          msg: "上传中...",
        });
      },
      onFileFinish: function (err, data, options) {
        if (!err) finishNum += 1;
        if (finishNum === totalNum) {
          // eslint-disable-next-line node/no-callback-literal
          callback({
            percent: 100,
            speed: 0,
            msg: "上传完毕",
          });
        } else {
          // eslint-disable-next-line node/no-callback-literal
          callback({
            percent: (100 * finishNum + percent) / totalNum,
            speed,
            msg: options.Key + "上传" + (err ? "失败" : "完成"),
          });
        }
        // console.log(options.Key + "上传" + (err ? "失败" : "完成"))
      },
    }, function (err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
export default {
  generateCode,
  addFiles,
  getFiles,
  downloadFiles,
  uploadFiles,
};
