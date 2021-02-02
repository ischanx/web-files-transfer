// 第一步，引入 Web SDK，
import tcb from "@cloudbase/js-sdk"

const baseURL = "https://cloudbase-demo-5gt7kvojbce1549e-1251137349.ap-guangzhou.app.tcloudbase.com"
// 第二步，初始化
const app = tcb.init({
  env: "cloudbase-demo-5gt7kvojbce1549e",
})

const get = async (url, params) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }
  let str = "?"
  Object.keys(params).forEach((key, index) => {
    if (!index) { str += key + "=" + params[key] } else str += "&" + key + "=" + params[key]
  })
  const res = await fetch(baseURL + url + str, options)
  return res.json()
}

const post = async (url, params) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  }
  const res = await fetch(baseURL + url, options)
  return res.json()
}

const uploadFile = (code, file) => {
  return app.uploadFile({
    // 云存储的路径
    cloudPath: `${code}/${file.name}`,
    // 需要上传的文件，File 类型
    filePath: file.raw,
  })
}

export const uploadFiles = async (code, fileList) => {
  console.log(fileList)

  const uploadRes = new Array(fileList.length)
  fileList.forEach((file, index) => {
    uploadRes[index] = uploadFile(code, fileList[index])
  })
  const res = await Promise.all(uploadRes)
  const data = []
  fileList.forEach((file, index) => {
    data.push({
      code: code,
      fileID: res[index].fileID,
      fileName: file.name,
    })
  })
  return post("/uploadFile", data)
}

export const getFiles = async ({ code, password }) => {
  return get("/getFiles", { code, password })
}

export const downloadFile = async fileID => {
  return app.downloadFile({ fileID })
}

export const createCode = async params => {
  return get("/getCode", params)
}
