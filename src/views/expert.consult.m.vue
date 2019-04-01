<template>
  <div class="expert-consult-m">
    <div class="expert-consult-main-m">
      <div class="consult-head">
        <div class="card-item">
          <div class="text">
            <div class="avatar-box">
              <div class="avatar" :style="{ 'background-image': 'url('+expert.img+')' }"></div>
            </div>
            <div class="msg">
              <h4><strong>{{ expert.name }}</strong></h4>
              <p><span>{{ expert.position }}</span></p>
              <p><span>{{ expert.company }}</span></p>
            </div>
          </div>
          <div class="btn">
            <p><span>{{ '咨询价格：'+expert.price+'元' }}</span></p>
          </div>
        </div>
      </div>
      <div class="consult-body">
        <div class="item">
          <div class="title"><label for="">问题题目</label></div>
          <div class="text"><input type="text" v-model="title" ></div>
        </div>
        <div class="item">
          <div class="title"><label for="">问题描述</label></div>
          <div class="text">
            <textarea v-model="desc"></textarea>
          </div>
        </div>
        <div class="item">
          <div class="upload-box">
            <div class="img-li" v-for="(i,index) in uploadList" :key="index"><img :src="i" alt=""></div>
          </div>
          <div class="text" v-show="uploadList.length < 3"><el-button type="info" :loading="uploading" @click="uploadimg">上传图片</el-button><input type="file" id="upload" @click.stop @change="upload($event)"></div>
        </div>
        <div class="item">
          <div class="title"><label for="">支付方式</label></div>
          <div class="text flex">
            <span>{{ '账户余额（'+balance+'元）' }}</span><i class="right"></i>
          </div>
        </div>
      </div>
      <div class="perview-footer">
        <el-button type="primary" :loading="payloading" @click="ask" >提问</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import * as qiniu from 'qiniu-js';
  import { MessageBox } from 'mint-ui';
  const defaultImageUser = require('../assets/defaultuser.jpg');
  export default {
    name: 'expertConsultM',
    data() {
      return {
        expert: {},
        balance: 0,
        disabled: false,
        uploadList: [],
        title: '',
        desc: '',
        id: '',
        uploading: false,
        payloading: false
      }
    },
    mounted() {
      this.getExpert()
      this.getCount()
    },
    methods: {
      getExpert() {
        this.$ajax.get('/user/detail/'+this.$route.params.id, {
          params: {
            user_id: '',
            token: ''
          }
        }).then(res => {
          if(res.data.result === 'success') {
            this.expert = {
              id: res.data.data.user_id,
              img: res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar, 50, 50) : defaultImageUser,
              name: res.data.data.name,
              position: res.data.data.company_position,
              company: res.data.data.company,
              skill: res.data.data.skill_name,
              price: res.data.data.ask_price
            }
            if(res.data.data.is_open_ask !== 1 || res.data.data.ask_price < 0) {
              MessageBox.alert('专家未开启咨询，无法咨询', '提示').then(action => {
                this.$router.go(-1)
              })
            }
          }
        }).catch(error => {

        })
      },
      getCount() {
        this.$ajax.post('/pay/myaccount',{
          user_id: localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || ''
        }).then(res => {
          if(res.data.result === 'success') {
            localStorage.setItem('token',res.data.token);
            this.balance = res.data.data.balance;
          }else if(res.data.data.errno === '-10002') {
            this.$router.push('/m/login');
          }
        }).catch(error => {

        })
      },
      uploadimg() {
        document.getElementById('upload').click()
      },
      upload(e) {
        let files = e.target.files;
        let fileName = files[0].name;
        let suffixIndex = fileName.lastIndexOf(".");
        let suffix = fileName.substring(suffixIndex+1).toUpperCase();
        if(suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF"){
          Toast('请上传图片！');
          return false;
        }
        let file = files[0];
        if(!files){
          return false;
        }
        this.getQiniuFile(file, 300, 200);
      },
      getQiniuFile(file) {
        this.uploading = true
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
        document.getElementById('upload').value = '';
      },
      toqiniu(file, key, Qntoken, putExtra, config) {
        let _this = this;
        let observable = qiniu.upload(file, key, Qntoken, putExtra, config);
        observable.subscribe({
          next(res) {
              // ...
          },
          error(err) {
            Toast('上传失败，请重试');
          },
          complete(res) {
            let domain = _this.$imageHost;
            let fopArr = [];
            let h = 375, w = 375;
            fopArr.push({
                fop: "imageView2",
                mode: 2,
                h: h,
                w: w,
                q: 100
            });
            let newUrl = qiniu.pipeline(fopArr, key, domain);
            _this.uploadList.push(newUrl)
            _this.uploading = false
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
      ask() {
        if(!this.title || !this.desc) {
          Toast('请补全问题信息！');
          return false;
        }
        MessageBox.confirm('你将购买该咨询服务,是否继续?').then(action => {
          this.payloading = true;
          this.$ajax.post('/qa/qsubmit', {
            eid: this.$route.params.id,
            user_id: localStorage.getItem('userid'),
            token: localStorage.getItem('token'),
            title: this.title,
            description: this.desc,
            img: this.getImageUrl(this.uploadList)
          }).then(res => {
            if(res.data.result === 'success') {
              this.id = res.data.data.last_id;
              localStorage.setItem('token', res.data.data.token)
              this.pay()
            }
          }).catch(error => {
            this.payloading = false;
          })
        }).catch(action => {
          // console.log('gg')
        })
      },
      pay() {
        this.$ajax.post('/pay/pay', {
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token'),
          paymethod: 1,
          paychannel: 'wap',
          good_id: this.id,
          good_type: 2,
          amount: this.expert.price,
          returnurl: ''
        }).then(res => {
          this.payloading = false;
          if(res.data.result === 'success') {
            MessageBox.alert('请打开筑英台网站(zyt.arctron.cn)或公众号查看专家回答', '提问成功！').then(action => {
              this.$router.push('/m/personal/consult')
            })
          }else {
            if(res.data.data.errno === '-60031') {
              MessageBox.alert('请打开筑英台PC端(zyt.arctron.cn)进行充值', '余额不足');
            }else {
              Toast('提问失败！');
            }
          }
        }).catch(error => {
          this.payloading = false;
          if(error.response) {
            Toast(error.response.data.message)
          }
        })
      },
      getImageUrl(url) {
        let newlist =[];
        for(let i = 0; i<url.length;i++){
          if(url[i].search(this.$imageHost) != -1) {
            newlist.push(url[i].split(this.$imageHost)[1]);
          }else {
            newlist.push(url[i]);
          }
        }
        return newlist;
      }
    }
  }
</script>

<style lang='less'>
.expert-consult-m {
  width: 100%;
  height: 100%;
  .expert-consult-main-m {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    .consult-body {
      margin-top: 10px;
      background: #fff;
      flex-grow: 1;
      padding: 10px 10px 100px 10px;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .title {
        line-height: 45px;
        label {
          color: #333;
          font-weight: bold;
          position: relative;
          padding-left: 10px;
        }
        label::before {
          content: '';
          width: 4px;
          height: 14px;
          background: #fadd1d;
          display: inline-block;
          position: absolute;
          top: 3px;
          left: 0;
        }
      }
      .upload-box {
        .img-li {
          text-align: center;
        }
      }
      .text {
        padding: 0 20px;
        input {
          outline: none;
          border: 1px solid #eee;
          width: 100%;
          height: 36px;
          color: #666;
          padding: 0 10px;
        }
        textarea {
          outline: none;
          border: 1px solid #eee;
          width: 100%;
          color: #666;
          font-size: 14px;
          padding: 10px;
          resize: none;
          height: 120px;
        }
        button {
          width: 100%;
          margin-top: 20px;
        }
        i.right {
          width: 22px;
          height: 22px;
          background: url('../assets/mobile/icon_gou@2x.png') no-repeat center center;
          background-size: 100%;
        }
        input[type='file'] {
          visibility: hidden;
        }
      }
      .flex {
        display: flex;
        justify-content: space-between;
      }
    }
    .perview-footer {
      position: fixed;
      z-index: 1;
      left: 0;
      bottom: 0;
      background-color: #fff;
      padding: 25px 16px;
      text-align: center;
      width: 100%;
      box-shadow: 0 0 10px #ccc;
      button {
        width: 100%;
        color: #333;
      }
    }
    .consult-head {
      background: #fff;
      padding: 0 10px;
      .card-item {
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 10px 0;
        .text {
          display: flex;
          .avatar-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            background-repeat: no-repeat;
            background-size: cover;
          }
          .msg {
            margin-left: 10px;
            p {
              margin: 5px 0;
              font-size: 14px;
              span {
                margin-right: 10px;
              }
            }
            h4 {
              color: #333;
            }
          }
        }
        .btn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          p {
            margin: 5px 0;
            font-size: 12px;
            text-align: center;
            color: #ff9933;
          }
        }
      }
    }
  }
}
</style>
