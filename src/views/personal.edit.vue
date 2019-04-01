<template>
<div class="personal-edit">
  <div class="personal-edit-main">
    <div class="edit-main-left">
      <personalTab />
    </div>
    <div class="edit-main-right">
      <div class="edit-image">
        <div class="edit-image-head">
          <img :src="form.avatar" width="120" height="120" alt="">
        </div>
        <div class="edit-image-foot">
          <el-button type="primary" @click="changeAvatar()" :loading="form.avatarLoading">修改头像</el-button>
          <input type="file" id="uploadfile" class="file" @change="upload($event)">
        </div>
      </div>
      <div class="edit-main-right-head">
        <h3><span>编辑个人资料</span></h3>
      </div>
      <div class="edit-main-right-body">
        <div class="edit-form">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="昵称">
              <el-input v-model="form.nickName" class="width-small" maxlength="10" placeholder="请输入昵称"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="form.name" placeholder="请输入姓名" class="width-small" maxlength="8" :readonly="!editStatus"></el-input>
            </el-form-item>
            <el-form-item label="公司">
              <el-input v-model="form.company" placeholder="请输入公司" class="width-large" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="form.position" placeholder="请输入职位" class="width-large" maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="社会职位">
              <div class="el-form-item-addcontent" v-show="form.socialPosition.list.length">
                <div class="addcontent-item" v-for="(s,index) in form.socialPosition.list" :key="index">
                  <span>{{ s.social }}</span><span class="right">{{ s.position }}</span>
                  <i class="el-icon-circle-close-outline" @click="clearSocialPosition(index)"></i>
                </div>
              </div>
              <div class="el-form-item-text">
                <el-input v-model="form.socialPosition.social" placeholder="请输入组织名称" class="width-small" maxlength="20"></el-input>
                <el-input v-model="form.socialPosition.position" placeholder="请输入职务名称" class="width-small margin-left" maxlength="10"></el-input>
                <button class="addbutton margin-left"
                :class="{'active': form.socialPosition.social && form.socialPosition.position}"
                @click.prevent="form.socialPosition.social && form.socialPosition.position && addSocialPosition()">添加</button>
              </div>
            </el-form-item>
            <el-form-item label="专长领域">
              <div class="el-form-item-addcontent" v-show="form.field.list.length">
                <div class="addcontent-item" v-for="(f,index) in form.field.list" :key="index"><span>{{ f.name }}</span>
                <i @click="clearField(index)" class="el-icon-circle-close-outline"></i>
              </div>
              </div>
              <div class="el-form-item-text">
                <el-input v-model="form.field.field" placeholder="请输入专长领域" class="width-large" maxlength="10"></el-input>
                <button class="addbutton margin-left" :class="{'active': form.field.field}" @click.prevent="form.field.field && addField()">添加</button>
              </div>
            </el-form-item>
            <el-form-item label="技能专长">
              <el-select v-model="form.skill.id" placeholder="请选择技能专长"  class="width-large" :disabled="!editStatus">
                <el-option :label="s.name" :value="s.id" v-for="(s,index) in form.skill.list" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.mobile" placeholder="请输入手机号" class="width-large" readonly ></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱" class="width-large" ></el-input>
            </el-form-item>
            <el-form-item label="个人经历">
              <el-input type="textarea" v-model="form.desc" class="width-large" maxlength="200" placeholder="200字以内"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit" class="addbutton active" :loading="form.loading">保存</el-button>
              <el-button type="info" @click="showCard('ref')" class="" v-show="form.professor_status > 0">生成电子名片</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
  <transition name="el-fade-in-linear"><cardMoudle :userid="userid" ref="changeStatus" @showCard="showCard" v-show="showcard"></cardMoudle></transition>
</div>
</template>

<script>
import personalTab from '@/views/personal.tab';
import * as qiniu from 'qiniu-js';
import Vue from 'vue';
import cropper from '@/components/cropper';
import cardMoudle from '@/components/cardMoudle';
const defaultuser = require('../assets/defaultuser.jpg');
export default {
  name: 'personalEdit',
  components: {
    personalTab,
    cardMoudle
  },
  mounted() {
    this.getMessage()
  },
  data() {
    return {
      form: {
        nickName: '',
        name: '',
        company: '',
        position: '',
        socialPosition: {
          social: '',
          position: '',
          list: [],
          value: []
        },
        field: {
          field: '',
          list: [],
          value: []
        },
        skill: {
          list: [],
          value: '',
          id: ''
        },
        mobile: '',
        email: '',
        desc: '',
        cert: '',
        avatar: '',
        avatarValue: '',
        avatarLoading: false,
        professor_status: '',
        professor_certificate_verify: '',
        loading: false
      },
      userid: localStorage.getItem('userid'),
      showcard: false,
      ecard_show: 0,
      editStatus: false
    }
  },
  methods: {
    onSubmit() {
      this.form.loading = true;
      this.$ajax.post('/user/edit',{
        user_id: localStorage.getItem('userid'),
        token: localStorage.getItem('token'),
        savedata: {
          nickname: this.form.nickName,
          name: this.form.name,
          skill_id: this.form.skill.id === '' ? 0 : this.form.skill.id,
          cert: this.form.cert,
          avatar: this.getImageUrl(this.form.avatarValue),
          company: this.form.company,
          company_position: this.form.position,
          social_position: this.form.socialPosition.value,
          expertise: this.form.field.value,
          email: this.form.email,
          description: this.form.desc,
          phone: this.form.mobile
        },
        t: 'default'
      }).then((res) => {
        // console.log(res)
        this.form.loading = false;
        if(res.data.result === 'success') {
          this.$message({ message: '保存成功！', type: 'success' })
          this.getMessage()
          Event.$emit('saveMessage','save')
          localStorage.setItem('token',res.data.data.token)
        }else {
          this.$message.error(res.data.data.errmsg)
          this.getMessage()
        }
      }).catch((error) => {
      // console.log(error)
      })
    },
    getMessage() {
      this.$ajax('/user/detail/'+localStorage.getItem('userid'),{
        params: {
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token')
        }
      }).then((res) => {
        this.$NProgress.done()
        // console.log(res)
        if(res.data.result === 'success') {
          let s_li = {},s_arr = [],sv_arr = [];
          for(let s = 0;s < res.data.data.social_position.length;s ++) {
            s_li = {
              social: res.data.data.social_position[s][0],
              position: res.data.data.social_position[s][1]
            }
            s_arr.push(s_li);
            sv_arr.push(res.data.data.social_position[s][0]+'|'+res.data.data.social_position[s][1])
          }
          let f_arr = [],fv_arr = [];
          for(let f = 0;f < res.data.data.expertise.length;f ++) {
            f_arr.push({
              name: res.data.data.expertise[f]
            });
            fv_arr.push(res.data.data.expertise[f])
          }
          this.form = {
            nickName: res.data.data.nickname,
            name: res.data.data.name,
            company: res.data.data.company,
            position: res.data.data.company_position,
            socialPosition: {
              social: '',
              position: '',
              list: s_arr,
              value: sv_arr
            },
            field: {
              field: '',
              list: f_arr,
              value: fv_arr
            },
            skill: {
              list: [],
              value: res.data.data.skill_name,
              id: res.data.data.skill_id === 0 ? '' : res.data.data.skill_id
            },
            mobile: res.data.data.phone,
            email: res.data.data.email,
            desc: res.data.data.description,
            cert: [],
            avatar: res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar, 120, 120) : defaultuser,
            avatarValue: res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar, 120, 120) : '',
            avatarLoading: false,
            professor_status: res.data.data.professor_status, //0:普通用户,n:第n次认证
            professor_certificate_verify: res.data.data.professor_certificate_verify, //0：未提交，1：提交中，2：通过，3：未通过
            loading:false
          }
          this.ecard_show = res.data.data.ecard_show;
          if(res.data.data.professor_status > 0) {
            this.editStatus = false;
          }else {
            if(res.data.data.professor_certificate_verify === 1) {
              this.editStatus = false;
            }else {
              this.editStatus = true;
            }
          }
          this.$ajax('/expert/skill').then((res) => {
            // console.log(res);
            if(res.data.result === 'success') {
              let list = res.data.data;
              for(let i = 0;i < list.length;i ++) {
                this.form.skill.list.push({
                  id: list[i].id,
                  name: list[i].name
                })
              }
            }
          })
        }else {
          if(res.data.data.errno === '-10002') {
            localStorage.setItem('token','');
            localStorage.setItem('userid','');
            this.$router.push('/login');
          }else {
            this.$message.error(res.data.data.errmsg)
          }
        }
      }).catch((error) => {
        // console.log(error);
      });
    },
    addSocialPosition() {
      this.form.socialPosition.list.push({
        social: this.form.socialPosition.social,
        position: this.form.socialPosition.position
      })
      let val = this.form.socialPosition.social+'|'+this.form.socialPosition.position;
      this.form.socialPosition.value.push(val);
      this.form.socialPosition.social = '';
      this.form.socialPosition.position = '';
    },
    clearSocialPosition(index) {
      this.form.socialPosition.list.splice(index,1);
      this.form.socialPosition.value.splice(index,1);
    },
    addField() {
      this.form.field.list.push({
        name: this.form.field.field
      });
      this.form.field.value.push(this.form.field.field);
      this.form.field.field = '';
    },
    clearField(index) {
      this.form.field.list.splice(index,1);
      this.form.field.value.splice(index,1);
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
          let domain = _this.$imageHost;
          let fopArr = [];
          fopArr.push({
              fop: "imageView2",
              mode: 2,
              h: 356,
              w: 356,
              q: 100
          });
          let newUrl = qiniu.pipeline(fopArr, key, domain);
          _this.form.avatar = newUrl || defaultuser;
          _this.form.avatarValue = newUrl;
          _this.form.avatarLoading = false;
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
    },
    showCard(type) {
      if(type && type === 'ref') {
        this.$refs.changeStatus.getStatus(this.ecard_show)
      }
      this.showcard = !this.showcard;
    }
  }
}
</script>

<style lang='less'>
.personal-edit {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 30px 0;
  width: 100%;
  overflow: hidden;
  .personal-edit-main {
    @media screen and ( min-width: 1380px ) {
      width: 1380px;
    }
    @media screen and ( max-width: 1380px ) {
      width: 1200px;
    }
    display: flex;
    justify-content: space-between;
    .edit-main-left {
      .personalTab-main {
        display: none;
      }
    }
    .edit-main-right {
      width: 1160px;
      background: #fff;
      border-radius: 4px;
      padding: 10px 80px 30px 30px;
      position: relative;
      .edit-main-right-head {
        h3 {
          color: #333;
          font-weight: bold;
          transition: all 0.15s;
          display: flex;
          line-height: 40px;
          span::after {
            content: '';
            height: 2px;
            background-color: #fed900;
            width: 100%;
            display: flex;
          }
        }
      }
      .edit-image {
        position: absolute;
        right: 80px;
        top: 60px;
        width: 120px;
        .edit-image-head {
          width: 100%;
          margin: 10px 0;
          height: 120px;
          img {
            width: 120px;
            border-radius: 50%;
          }
        }
        .edit-image-foot {
          button {
            width: 100%;
            height: 40px;
          }
          .file {
            visibility: hidden;
          }
        }
      }
      .edit-main-right-body {
        width: 666px;
        padding-top: 30px;
        position: relative;
        .el-form-item__label {
          color: #999;
        }
        .width-small {
          width: 210px;
        }
        .el-input__inner ,textarea{
          background: #f4f4f4;
        }
        .width-large {
          width: 440px;
        }
        .margin-left {
          margin-left: 15px;
        }
        .addbutton {
          background: #ccc;
          border: 1px solid #ccc;
          cursor: pointer;
          width: 120px;
          height: 40px;
          outline: none;
          border-radius: 4px;
          transition: all 0.3s;
        }
        .addbutton.active {
          background: #fed900;
          border: 1px solid #fed900;
        }
        .addbutton:hover {
          color: #606266;
          border: 1px solid #ccc;
        }
        .el-form-item-addcontent {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          .addcontent-item {
            border-radius: 4px;
            transition: all 0.3s;
            padding-right: 5px;
            color: #666;
            margin: 0 10px 10px 0;
            span {
              padding-right: 10px;
            }
            span.right {
              padding-left: 10px;
              border-left: 1px solid #ccc;
            }
            i {
              display: inline-block;
              cursor: pointer;
              color: #fff;
            }
          }
          .addcontent-item:hover {
            background: #999;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
