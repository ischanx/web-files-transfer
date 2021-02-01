<template>
  <div>
    <el-input v-model="code" placeholder="请输入收集码"></el-input>
    <el-upload
      class="upload-demo"
      action=""
      :on-change="handleChange"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="1"
      :auto-upload="false"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
      <el-button @click="upload">开始上传</el-button>
      <div slot="tip" class="el-upload__tip">不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>

// @ is an alias to /src
import { uploadFiles } from "../utils/request.js"

export default {
  name: 'Send',
  data(){
    return {
      code:"",
      fileList: []
    }
  },
  mounted(){
    if(this.$route.query.code){
      this.code = this.$route.query.code;
    }
  }, 
  methods: {
    async upload(){
      if(this.code === "" || this.fileList.length === 0) return;
      console.log(this.fileList)
      const res = await uploadFiles(this.code,this.fileList);
      this.fileList = [];
      if(res.type){
        alert("上传成功")
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleChange(file,fileList) {
      this.fileList = fileList;
      console.log(file,fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  },
}
</script>
