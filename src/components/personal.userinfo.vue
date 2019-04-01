<template>
  <div class="expertInformation">
    <div class="expert-quizInfo">
      <div class="quiz-expert-img">
        <div class="img-box">
          <img src="../assets/defaultuser.jpg" alt="" v-show='expertinfo.avatar==""?true:false'>
          <img :src="expertinfo.avatar?$getImageUrl(expertinfo.avatar, 128, 128):''" alt="" v-if='expertinfo.avatar==""?false:true'>
        </div>
        <!-- <div class="attention-expert-changeimg" @click.stop="uploadHeadImg">更换头像</div> -->
        <el-button type="primary" @click="changeAvatar()" class='changimg'>修改头像</el-button>
        <input type="file" id="uploadfile" class="file" @change="upload($event)">
        <div class="attention-expert" @click.stop="personalAddProject"><el-button type="primary">上传作品</el-button></div>
      </div>
      <input type="file" accept="image/*" @change="handleFile" class="hiddenInput"/>
      <div class="quiz-expert-information">
        <div class="expert-base">
          <span class='expert-base-name' v-text='expertinfo.professor_status>0?expertinfo.name:expertinfo.nickname'></span>
          <span class="expert-base-lavel"  v-show='expertinfo.professor_status>0?true:false'></span>
          <!-- 暂时隐藏积分 -->
          <!-- <span class="expert-base-score">
            {{credit}}积分
          </span> -->
        </div>
        <div class="expert-dsec" v-text='expertinfo.description'></div>
        <div class="expert-skill">
          <span class='expert-skill-work centerline' v-text='expertinfo.skill_name' v-show='expertinfo.skill_name?true:false'></span>
          <span class='expert-skill-workposition centerline-last'  v-show='expertinfo.expertise?true:false'>
            <span class='skill-list' v-for='(skillitem,index) in expertinfo.expertise' :key='index' v-text='skillitem'></span>
          </span>
        </div>
        <div class="expert-company">
          <span class="expert-desc-company centerline" v-text='expertinfo.company' v-show='expertinfo.company?true:false'></span>
          <span class="expert-desc-position centerline-last" v-text='expertinfo.company_position' v-show='expertinfo.company_position?true:false'></span>
        </div>
        <div class="expert-social">
          <!-- <span class="expert-social-work centerline" v-text='expertinfo.social'></span>
          <span class="expert-social-workposition centerline-last" v-text='expertinfo.socialposition'></span> -->
          <div class="expert-social-work" v-for='(lists,index) in expertinfo.position' :key='index'>
            <span class="social centerline" v-text='lists[0]'></span>
            <span class="socialwork centerline-last" v-text='lists[1]'></span>
          </div>
        </div>
      </div>
      <div class="quiz-expert-price">
        <div class="">
          <router-link :to="{path:'/personal/edit'}" class='quiz-expert-price-edit'>编辑资料</router-link>
          <router-link :to="{path:'/personal/apply'}" class='quiz-expert-price-apply'>申请专家</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as qiniu from 'qiniu-js';
import Vue from 'vue';
import cropper from '@/components/cropper';
const defaultImageUser = require('../assets/defaultuser.jpg')
export default {
  name: 'expertInformation',
  data () {
    return {
      expertinfo:{},
      userInfo: {},
      form: {
        nickName: '',
        name: '',
        company: '',
        position: '',
        socialPosition: {},
        field: {},
        skill: {},
        mobile: '',
        email: '',
        desc: '',
        cert: '',
        avatar: '',
      },
      credit:''
    }
  },
  mounted () {
    // console.log(this.$router)
    this.account();
    this.getMessage();
  },
  methods:{
    personalAddProject(){
      this.$router.push({ name: 'personalAddProject'})
    },
    getMessage() {
      let userid=localStorage.getItem("userid");
      axios.all([this.$ajax('/user/detail/'+userid,{
        params: {
          user_id: localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || ''
        }
      })])
      .then(axios.spread((userinfo) => {
        this.getUserinfo(userinfo);
        this.$NProgress.done();
      })).catch((error) => {
        console.log(error)
      })
    },
    getUserinfo(res){
      let userinfo = res.data.data;
      this.expertinfo=userinfo;
      if(this.expertinfo.nickname==''){
        this.expertinfo.nickname='昵称';
      }
      this.expertinfo.position=res.data.data.social_position;
      let s_li = {},s_arr = [],sv_arr = [];
      for(let s = 0;s < res.data.data.social_position.length;s ++) {
            s_li = {
              social: res.data.data.social_position[s][0],
              position: res.data.data.social_position[s][1]
            }
            s_arr.push(s_li);
            sv_arr.push(res.data.data.social_position[s][0]+'|'+res.data.data.social_position[s][1])
          }
      this.expertinfo.social_position=sv_arr;
      // Event.$emit('userphone',this.expertinfo.phone);
    },
    // 打开图片上传
    uploadHeadImg: function () {
      this.$el.querySelector('.hiddenInput').click()
    },
    // 将头像显示
    handleFile: function (e) {
      let $target = e.target || e.srcElement
      let file = $target.files[0]
      var reader = new FileReader()
      reader.onload = (data) => {
        let res = data.target || data.srcElement
        this.expertinfo.avatar = res.result
      }
      reader.readAsDataURL(file)
    },
    //获取积分
    account(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/myaccount',
        data:{
          "user_id":userid,
          "token":token
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        this.credit=res.data.data.credit;
      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
    //点击上传作品
    downloadProject(){
      alert('去上传作品');
    },
    onSubmit() {
      this.$ajax.post('/user/edit',{
        user_id: localStorage.getItem('userid'),
        token: localStorage.getItem('token'),
        savedata: this.expertinfo,
        t: 'default'
      }).then((res) => {
        // console.log(res)
        if(res.data.result === 'success') {
          this.$message({ message: '保存成功！', type: 'success' })
          this.getMessage()
          Event.$emit('saveMessage','save')
        }else{
          alert(res.data.data.errmsg);
        }
      }).catch((error) => {
      // console.log(error)
      })
    },
    changeAvatar() {
      document.getElementById('uploadfile').click()
    },
    showCropper(file, w, h) {
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
            _this.form.avatarLoading = false;
            document.body.removeChild(document.getElementById('imagecropper'));
          },
          getNewFile(data) {
            this.newFile = this.dataURLtoFile(data,this.file.name);
            if(!this.newFile) {
              _this.getQiniuFile(this.file)
            }else {
              _this.getQiniuFile(this.newFile)
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
    upload(e) {
      this.form.avatarLoading = true;
      let files = e.target.files;
      let fileName = files[0].name;
      let suffixIndex = fileName.lastIndexOf(".");
      let suffix = fileName.substring(suffixIndex+1).toUpperCase();
      if(suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF"){
        this.$message.error('请上传图片！');
        this.form.avatarLoading = false;
        return false;
      }
      let file = files[0];
      if(!files){
        return false;
      }
      this.showCropper(file, 356, 356);
    },
    getQiniuFile(file) {
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
          this.toqiniu(file, key, Qntoken, putExtra, config);
      }else{
        this.$ajax.get('/other/qiniu').then((res) => {
          this.SetCookie('Qntoken',res.data.data.token);
          this.toqiniu(file, key, res.data.data.token, putExtra, config);
        })
      }
      document.getElementById('uploadfile').value = '';
    },
    toqiniu(file, key, Qntoken, putExtra, config) {
      let _this = this;
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
              h: 356,
              w: 356,
              q: 100
          });
          var newUrl = qiniu.pipeline(fopArr, key, domain);
          _this.expertinfo.avatar = _this.getImageUrl(newUrl);
          console.log(_this.expertinfo);
          _this.onSubmit();
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
    getImageUrl(url) {
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
<style scoped lang='less'>
.expert-quizInfo{
      padding-bottom: 20px;
      background: #fff;
      display: flex;
      border-radius: 3px;
      padding: 0 10px 25px;
      position: relative;
      min-height:230px;
      .hiddenInput{
        display: none;
      }
      .quiz-expert-img{
        position: absolute;
        padding: 10px;
        background: #fff;
        top: -30px;
        width: 128px;
        height: 128px;
        border-radius: 3px;
        box-sizing: content-box;
        margin-left: 20px;
        .img-box {
          width: 128px;
          height: 128px;
          overflow: hidden;
        }
        img{
          width: 100%;
        }
        .file{
          // visibility: hidden;
          display: none;
        }
        .attention-expert{
            width: 128px;
            height: 30px;
            background: #fed900;
            border-radius: 3px;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
            color: #333;
            margin-top: 10px;
            button{
              width: 128px;
              height: 30px;
              color: #333;
              padding: 0;
            }
        }
        .attention-expert-changeimg{
          width: 128px;
          height: 30px;
          border: 1px solid #cccccc;
          border-radius: 3px;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          color: #333;
          margin-top: 10px;
          cursor: pointer;
        }
        .changimg{
          width: 128px;
          height: 30px;
          border-radius: 3px;
          text-align: center;
          line-height: 30px;
          font-size: 14px;
          color: #333;
          margin-top: 10px;
          padding: 0;
        }
      }
      .quiz-expert-information{

        margin-left: 198px;
        font-size: 14px;
        color: #999;
        flex:1;
        .expert-base{
          margin-top: 20px;
          height: 35px;
          border-bottom: 1px solid #cccccc;
          .expert-base-name{
            color: #333434;
            font-size: 24px;
            font-weight: 700;
            margin-right: 25px;
          }
          .expert-base-lavel{
            margin-right: 28px;
            position: relative;
            color: #212121;
          }
          .expert-base-lavel:before{
              content: '';
              width: 9px;
              height: 9px;
              border-radius: 9px;
              background: url('../assets/fffff_03.png');
              position: absolute;
              top: -9px;
              right: 12px;
          }
          .expert-base-score{
              color: #212121;
          }
        }
        .expert-dsec{
          margin-top: 12px;
          margin-bottom: 20px;
          line-height: 25px;
          color: #333;
        }
        .centerline{
              padding-right: 12px;
        }
        .centerline-last{
            padding-left: 12px;
            border-left: 1px solid #ccc;
            .skill-list{
              margin-right: 10px;
            }
        }
        .expert-skill{
          line-height: 22px;
        }
        .expert-company{
          line-height: 22px;
        }
      }
      .quiz-expert-price{
        // width: 515px;
          a{
            display: inline-block;
            width: 140px;
            height: 30px;
            border:1px solid #dadada;
            border-radius: 3px;
            line-height: 30px;
            font-size: 16px;
            color: #333;
            margin-top: 30px;
            margin-left: 10px;
            margin-right: 10px;
          }
          a:hover{
            background: #fed900;
            border: 1px solid #fed900;
          }
          .quiz-expert-price-edit{
            padding-left: 48px;
            position: relative;
            margin-left: 30px;
          }
          .quiz-expert-price-edit:before{
            content: '';
            width: 17px;
            height: 17px;
            background: url('../assets/Write.png');
            position: absolute;
            top: 6px;
            left: 22px;
          }
          .quiz-expert-price-apply{
            padding-left: 48px;
            position: relative;
            margin-left: 10px;
          }
          .quiz-expert-price-apply:before{
            content: '';
            width: 17px;
            height: 17px;
            background: url('../assets/Bookmark.png');
            position: absolute;
            top: 6px;
            left: 22px;
          }
          .show-code {
            text-align: center;
            padding-top: 10px;
            padding-left: 15px;
            p {
              margin: 5px 0;
            }
          }
      }
    }
</style>
