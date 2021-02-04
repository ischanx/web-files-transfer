<template>
  <div id="container">
    <img id="logo" src="plane.svg"/>
        <div id="menu">
      <el-tooltip placement="right" effect="light">
        <div slot="content">
          nothing
        </div>
        <el-button type="primary" round @click="showUpload">发送/提交<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-tooltip>
      <el-button round @click="showDownload">接收/收集<i class="el-icon-download el-icon--right"></i></el-button>
      <el-link type="info" @click="showCollect">需要收集文件？点击我来创建一个收集码吧！</el-link>
    </div>
    <el-dialog
      title="文件传输"
      :visible.sync="uploadVisable"
      width="40%"
      center>
      <el-form label-width="80px" label-position="left" ref="uploadForm"  size="small">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="uploadForm.name" placeholder="输入您的名称，方便您的好友确认"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description" >
          <el-input v-model="uploadForm.description" placeholder="输入此次收集的简介"></el-input>
        </el-form-item>
        <el-form-item label="上传文件" prop="files" required>
          <el-upload
            class="upload-demo"
            action=""
            :auto-upload="false"
            :on-change="fileChange"
            :on-remove="fileRemove"
            :before-remove="beforeFileRemove"
            :on-exceed="fileExceed"
            :limit="3"
            multiple
            :file-list="uploadForm.files">
            <el-button slot="trigger" type="primary">点击选择</el-button>
            <!-- <el-button @click="upload">开始上传</el-button> -->
            <div slot="tip" class="el-upload__tip">不超过3个文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="传输类型" required>
           <el-radio-group v-model="uploadForm.type">
            <el-radio-button label="提交文件"></el-radio-button>
            <el-radio-button label="发送文件"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline" v-if="uploadForm.type === '提交文件'" required>
          <el-select v-model="uploadForm.deadline" placeholder="选择收集截止时间">
            <el-option label="1分钟" value="60"></el-option>
            <el-option label="3分钟" value="180"></el-option>
            <el-option label="5分钟" value="300"></el-option>
            <el-option label="10分钟" value="600"></el-option>
            <el-option label="20分钟" value="1200"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分享密码" prop="password" v-if="uploadForm.type === '提交文件'" required>
          <el-input
            v-model="uploadForm.password"
            placeholder="密码">
          </el-input>
        </el-form-item>
        <el-form-item label="收集码" prop="code" v-if="uploadForm.type !== '提交文件'" required>
          <el-input
            v-model="uploadForm.code"
            placeholder="发送文件时可为空">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="upload">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="当前进度"
      :visible.sync="progressVisable"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      center>
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="uploadPercent">
        </el-progress>
        <p><strong>上传速度：</strong>{{uploadSpeed + "MB/s"}}</p>
        <p><strong>信息：</strong>{{uploadMsg}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="progressVisable = false" :disabled="uploadPercent !== 100" size="small">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="接收文件"
      :visible.sync="downloadVisable"
      width="40%"
      center>
        <el-form size="small" :model="downloadForm">
          <el-form-item>
            <el-input
              v-model="downloadForm.code"
              placeholder="请输入取件码"
              size="small">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="downloadForm.password"
              placeholder="请输入密码，没有密码则为空"
              size="small">
            </el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="download" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="创建收集"
      :visible.sync="collectVisable"
      width="35%"
      center>
      <el-form :model="collectForm" label-width="80px" label-position="left" ref="collectForm" size="small">
        <el-form-item label="名称" prop="name" required>
          <el-input v-model="collectForm.name" placeholder="输入您的名称，方便您的好友确认"></el-input>
        </el-form-item>
        <el-form-item label="简介" prop="description" >
          <el-input v-model="collectForm.description" placeholder="输入此次收集的简介"></el-input>
        </el-form-item>
        <el-form-item label="截止时间" prop="deadline"  required>
          <el-select v-model="collectForm.deadline" placeholder="选择收集截止时间">
            <el-option label="1分钟" value="60"></el-option>
            <el-option label="3分钟" value="180"></el-option>
            <el-option label="5分钟" value="300"></el-option>
            <el-option label="10分钟" value="600"></el-option>
            <el-option label="20分钟" value="1200"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="保留时间" prop="retention"  required>
          <el-select v-model="collectForm.retention" placeholder="选择收集保留时间">
            <el-option label="1分钟" value="60"></el-option>
            <el-option label="3分钟" value="180"></el-option>
            <el-option label="5分钟" value="300"></el-option>
            <el-option label="10分钟" value="600"></el-option>
            <el-option label="20分钟" value="1200"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="collectForm.password" placeholder="密码为空则他人可通过收集码查看收集到的文件"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generateCollectCode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      uploadVisable: false,
      uploadForm: {
        name: "",
        description: "",
        type: "提交文件",
        deadline: "",
        code: "abcd",
        files: [],
        password: "",
      },
      progressVisable: false,
      uploadPercent: 0,
      uploadSpeed: 0,
      uploadMsg: "",
      downloadVisable: false,
      downloadForm: {
        code: "",
        password: "",
      },
      collectVisable: false,
      collectForm: {
        name: "chanx",
        description: "desc",
        deadline: "",
        retention: "",
        password: "1234",
      },
    };
  },
  methods: {
    showUpload () {
      this.uploadVisable = true;
    },
    showDownload () {
      this.downloadVisable = true;
    },
    showCollect () {
      this.collectVisable = true;
    },
    fileRemove (file, fileList) {
      console.log(file, fileList);
    },
    fileChange (file, fileList) {
      this.uploadForm.files = fileList;
      console.log(file, fileList);
    },
    fileExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeFileRemove (file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onUploadProgress ({ percent, speed, msg }) {
      this.uploadPercent = percent === 100 ? 99 : percent;
      this.uploadSpeed = speed;
      this.uploadMsg = msg;
    },
    async upload () {
      // 上传到COS
      this.uploadPercent = 0;
      this.uploadSpeed = 0;
      this.uploadMsg = "上传中...";
      this.uploadVisable = false;
      this.progressVisable = true;
      const uploadRes = await this.$request.uploadFiles(this.uploadForm.code, this.uploadForm.files, this.onUploadProgress);
      const success = uploadRes.files.filter(item => item.error === null);
      const fileList = success.map(item => {
        return {
          fileName: item.options.Key,
          name: this.uploadForm.name,
          description: this.uploadForm.description,
        };
      });
      console.log(uploadRes, fileList);
      const addRes = await this.$request.addFiles({ fileList, code: this.uploadForm.code });
      if (addRes.type) {
        this.uploadMsg = `共上传${uploadRes.files.length}个文件，${success.length}个成功，${uploadRes.files.length - success.length}个失败`;
      } else {
        this.uploadMsg = "上传失败";
      }
      this.uploadPercent = 100;
      console.log(addRes);
      this.uploadForm.files = [];
    },
    async download () {
      const params = {
        code: this.downloadForm.code,
        password: this.downloadForm.password,
      };
      const res = await this.$request.getFiles(params);
      if (res.type) {
        console.log(res);
        const download = await this.$request.downloadFiles(res.fileList);
        console.log(download);
        window.open(download[0], "blank");
      } else {
        this.$message.error(res.errMsg);
      }
      this.downloadVisable = false;
    },
    async generateCollectCode () {
      this.$refs.collectForm.validate(async valid => {
        if (valid) {
          const params = Object.assign({}, this.collectForm);
          const now = Date.now() + 30000; // 30s误差量
          params.deadline = params.deadline * 1000 + now;
          params.retention = params.deadline + params.retention * 1000;
          params.type = "collect";
          console.log("生成收集码参数", params);
          const res = await this.$request.generateCode(params);
          console.log("生成收集码结果", res);
          if (res.type) {
            this.collectVisable = false;
            this.$alert(`<p>这是您的收集码：<strong style="color:red;">${res.code}</strong></p>
              <p>收集截止时间：${new Date(params.deadline)}</p>
              <p>收集删除时间：${new Date(params.retention)}</p>
              <p>请留意截止时间跟删除时间噢！</p>`, "嘀嘀嘀！您的飞机准备好了", {
              dangerouslyUseHTMLString: true,
            }).then(() => {});
          }
        }
      });
    },
  },
};
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
}
#logo{
  display: block;
  margin: 0 auto;
  transform: rotate(10deg);
  animation:fly 3s ease-in-out;
}
#logo:hover{
  transform: rotate(370deg);
  transition: all 1s;
}

@keyframes fly{
  0%{
    margin-top:20px ;
    margin-left:0px;
    transform: rotate(15deg);
  }
  50%{
    margin-top:-80px ;
  }
  100%{
    margin-top:100px ;
    margin-left:calc(80%);
    transform: rotate(70deg);
  }
}

#menu > .el-button{
  display: block;
  padding: 15px 80px;
  margin: 20px;
  font-size: 1em;
}

.el-form-item{
  margin-bottom: 15px;
}
</style>
