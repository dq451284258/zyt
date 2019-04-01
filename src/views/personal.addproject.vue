<template>
  <div class="personalAddProject">
    <div class="add-projects-title">作品集</div>
    <div class="add-project-main">
        <div class='item'>
            <div class="quiz-desctibe-title">项目名称</div>
            <el-input v-model="questiontitle" placeholder="请输入内容" class='quiz-input'></el-input>
        </div>
        <div class='item'>
            <div class="quiz-desctibe-title">项目简介</div>
            <el-input class='quiz-input' type="textarea" :rows="2" placeholder="请输入内容" v-model="questiondesc"></el-input>
        </div>
        <div class="expert-quizAddimg">
          <div class="quiz-desctibe-title">添加图片</div>
          <ul class='addimg'>
            <li v-show='projectitems'>
              <img :src="projectitems" alt="">
            </li>
            <li @click="changeAvatar()"><i class='el-icon-circle-plus-outline'></i></li>
          </ul>
          <input type="file" id="uploadfiles" class="file" @change="uploadproject($event)">
        </div>
        <div class="add-project-button">
            <el-button type="primary" @click='postquestion' :loading="loadshow" class='add-project-tosave-left' v-html='addtext'></el-button>
            <router-link to='/personal/projects'><el-button type="primary" class='add-project-tosave'>取消</el-button></router-link>
        </div>
    </div>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js';
import Vue from 'vue';
import cropper from '@/components/cropper';
export default {
  name: 'personalAddProject',
  data () {
    return {
      questiontitle:'',
      questiondesc:'',
      projectitems:'',
      loadshow:false,
      addtext:'提交'
    }
  },
  mounted () {
  },
  methods:{
       //提问问题
    postquestion(){
      if(this.questiontitle==''){
        this.$alert("项目名称不能为空", '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }
      if(this.questiontitle.length>25){
        this.$alert("项目名称不能超过25个字", '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }
      if(this.questiondesc==''){
        this.$alert("项目描述不能为空", '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }
      if(this.questiondesc.length>250){
        this.$alert("项目描述不能超过250个字", '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }
      if(this.projectitems==''){
        this.$alert("项目图片不能为空", '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }
      this.loadshow=true;
      this.addtext=`<i class="el-icon-loading"></i>加载中`;
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/user/saveproject',
        data:{
          "p_name":this.questiontitle,
          "user_id":userid,
          "token":token,
          "p_desc":this.questiondesc,
          "p_img":this.getImageUrladd(this.projectitems)
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result==='success'){
          this.$alert('添加作品成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$router.push({ name: 'personalProjects'})
            }
          });
        }else{
          if(res.data.data.errno=="-10002"){
            this.$confirm('您还没有登录, 是否登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push('/login')
            }).catch(() => {
            });
          }else{
            this.$alert(res.data.data.errmsg, '提示', {
              confirmButtonText: '确定',
              callback: action => {
              }
            });
          }
        }
      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
      tocancel(index){
      this.projectitems.splice(index, 1);
    },
    changeAvatar() {
      document.getElementById('uploadfiles').click()
    },
    showCropperadd(file, w, h) {
      let ndiv = document.createElement('div');
      ndiv.setAttribute('id','imagecropper');
      document.body.appendChild(ndiv);
      const _this = this;
      let Cropper = Vue.extend({
        data() {
          return {
            file: file,
            w: w,
            h: h,
            newFile: ''
          }
        },
        components: {
          cropper
        },
        template: `<cropper :file="this.file" :w="this.w" :h="this.h" @closeCropper="this.closeCropper" @getNewFile="this.getNewFile"></cropper>`,
        methods: {
          closeCropper() {
            document.body.removeChild(document.getElementById('imagecropper'));
          },
          getNewFile(data) {
            this.newFile = this.dataURLtoFile(data,this.file.name);
            if(!this.newFile) {
              _this.getQiniuFileadd(this.file)
            }else {
              _this.getQiniuFileadd(this.newFile)
            }
            document.body.removeChild(document.getElementById('imagecropper'));
          },
          dataURLtoFile(dataurl) {
            return dataurl;
          }
        }
      });
      new Cropper().$mount('#imagecropper');
    },
    uploadproject(e) {
      let files = e.target.files;
      let fileName = files[0].name;
      let suffixIndex = fileName.lastIndexOf(".");
      let suffix = fileName.substring(suffixIndex+1).toUpperCase();
      if(suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF"){
        this.$message.error('请上传图片！');
        return false;
      }
      let file = files[0];
      if(!files){
        return false;
      }
      this.showCropperadd(file, 212, 136);
    },
    getQiniuFileadd(file) {
      let Num = "";
      for(let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
      }
      let key = new Date().getTime() + Num;
      let config = {
        useCdnDomain: true,
        region: qiniu.region.z0
      };
      let putExtra = {
        fname: '',
        params: {},
        mimeType: [] || null
      };
      let token = localStorage.getItem('token');
      if(this.GetCookie('Qntoken') && this.GetCookie('Qntoken') != 'undefined'){
          let Qntoken = this.GetCookie('Qntoken');
          this.toqiniuproject(file, key, Qntoken, putExtra, config);
      }else{
        this.$ajax.get('/other/qiniu').then((res) => {
          this.SetCookie('Qntoken',res.data.data.token);
          this.toqiniuproject(file, key, res.data.data.token, putExtra, config);
        })
      }
      document.getElementById('uploadfile').value = '';
    },
    toqiniuproject(file, key, Qntoken, putExtra, config) {
      let _this = this;
      let imgList='';
      let observable = qiniu.upload(file, key, Qntoken, putExtra, config);
      observable.subscribe({
        next(res) {
            // ...
        },
        error(err) {
          this.$message.error('上传失败，请重试');
        },
        complete(res) {
          let domain = 'http://zyt-file.arctron.cn';
          let fopArr = [];
          fopArr.push({
              fop: "imageView2",
              mode: 2,
              h: 136,
              w: 212,
              q: 100
          });
          var newUrl = qiniu.pipeline(fopArr, key, domain);
          _this.projectitems = newUrl;
        }
      });
    },
    GetCookie(name) {
      let arg = name + "=";
      let alen = arg.length;
      let clen = document.cookie.length;
      let i = 0;
      while (i < clen) {
        let j = i + alen;
        if (document.cookie.substring(i, j) == arg) return this.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
      }
      return null;
    },
    SetCookie(name, value) {
      let Days = 30;
      let exp = new Date();
      exp.setTime(exp.getTime() + 60 * 15000);//过期时间 15分钟
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookieVal(offset) {
      let endstr = document.cookie.indexOf(";", offset);
      if (endstr == -1) endstr = document.cookie.length;
      return unescape(document.cookie.substring(offset, endstr));
    },
    getImageUrladd(url) {
      if(url.search(this.$imageHost) != -1) {
        return url.split(this.$imageHost)[1]
      }else {
        return url
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.personalAddProject{
  padding: 20px 20px 0 32px;
  .quiz-desctibe-title{
      width: 90px;
      line-height: 42px;
      font-size: 14px;
      color: #999;
  }
  .add-projects-title{
    font-size: 16px;
    font-weight: 700;
    color: #2f2e2e;
    line-height: 40px;
    margin-right: 30px;
    position: relative;
    width: 70px;
    margin-bottom: 20px;
  }
  .add-projects-title:before{
    content:'';
    width: 4px;
    height: 12px;
    background: #fed900;
    position: absolute;
    top: 14px;
    left: -32px;
  }
  .add-project-main{
      .quiz-desctibe-title{
          display: inline-block;
      }
      .item{
          display: flex;
          padding-right: 430px;
          margin-bottom: 18px;
          .el-textarea__inner{
              height: 145px!important;
          }
      }
      .expert-quizAddimg{
    //   margin-top: 20px;
    //   padding: 30px 28px;
      background: #fff;
      border-radius: 3px;
      display: flex;
      .addimg{
        display: flex;
        li{
          width: 212px;
          height: 136px;
          border: 1px solid #cccccc;
          line-height: 148px;
          text-align: center;
          border-radius: 3px;
          position: relative;
          i{
            font-size: 40px;
            color: #ccc;
          }
          .el-icon-delete{
            width: 35px;
            height: 28px;
            background: #000;
            opacity: 0.3;
            font-size: 18px;
            line-height: 28px;
            border-radius: 0 3px 0 0;
            color:#fff;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
      .quiz-addimg-title{
        margin-bottom: 30px;
        display: inline-block;
        font-size: 16px;
        color: #2f2e2e;
        height: 28px;
        border-bottom: 2px solid #fed900;
      }      
      .file {
        visibility: hidden;
      }
    }
    .add-project-button{
        margin-top: 48px;
        margin-bottom: 50px;
        display: flex;
        justify-content: center;
        .button{
            width: 165px!important;
            height: 42px;
            padding: 0;
        }
        .add-project-tosave-left{
            margin-right: 18px;
            width: 165px!important;
            height: 42px;
            padding: 0;
            color: #666;
            font-size: 16px;
        }
        .add-project-tosave{
            margin-right: 18px;
            width: 165px!important;
            height: 42px;
            padding: 0;
            color: #666;
            font-size: 16px;
            background: #fff;
            border: 1px solid #ccc;
        }
    }
  }
}
</style>
