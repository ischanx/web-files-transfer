<template>
  <div>
    <el-input v-model="code" placeholder="请输入收集码"></el-input>
    <el-input v-model="password" placeholder="请输入密码"></el-input>
    <el-button type="primary" @click="getCollection">查看收集</el-button>
    <el-select v-model="finishTime" placeholder="请选择收集截止时间">
      <el-option label="1分钟" value="60"></el-option>
      <el-option label="5分钟" value="300"></el-option>
      <el-option label="10分钟" value="600"></el-option>
      <el-option label="20分钟" value="1200"></el-option>
    </el-select>
    <el-select v-model="keepTime" placeholder="请选择收集保留时间">
      <el-option label="1分钟" value="60"></el-option>
      <el-option label="5分钟" value="300"></el-option>
      <el-option label="10分钟" value="600"></el-option>
      <el-option label="20分钟" value="1200"></el-option>
    </el-select>
    <el-button type="primary" @click="createCode">创建收集</el-button>
    <!-- <a :href="'http://localhost:8080/#/?code='+ this.code"  target="blank">{{"http://localhost:8080/#/?code=" + this.code}}</a> -->
    <div v-for="item in fileList" :key="item.fileName">
      <p>{{item.fileName}}</p>
      <p>{{item.fileID}}</p>
      <el-button @click="downloadFile(item.fileID)">下载</el-button>
    </div>
  </div>
</template>

<script>
import { getFiles, downloadFile, createCode } from "../utils/request"
export default {
  data () {
    return {
      code: "",
      password: "",
      fileList: [],
      finishTime: "",
      keepTime: "",
    }
  },
  mounted () {
    if (this.$route.query.code) {
      this.code = this.$route.query.code
    }
  },
  methods: {
    async createCode () {
      const now = Date.now()
      const { password } = this
      const deadline = now + this.finishTime * 1000
      const keepTime = deadline + this.keepTime * 1000
      const res = await createCode({ password, deadline, keepTime })
      if (res.type) {
        alert("获取收集码成功")
        this.code = res.code
        this.password = ""
      }
    },
    async getCollection () {
      const res = await getFiles({ code: this.code, password: this.password })
      this.fileList = res
    },
    async downloadFile (id) {
      downloadFile(id)
    },
  },
}
</script>

<style>

</style>
