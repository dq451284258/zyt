<template>
  <div class="personal-answer-detail-m">
    <div class="personal-answer-detail-main-m">
      <div class="detail-head">
        <h4><span class="name">{{ ask.name }}</span><span>提出问题</span></h4>
        <h4><span>{{ ask.time }}</span></h4>
      </div>
      <div class="detail-body">
        <div class="title"><label for=""><span>咨询内容</span></label></div>
        <div class="content">
          <h3><strong>{{ ask.title }}</strong></h3>
          <p><span>{{ ask.desc }}</span></p>
          <div class="image">
            <div class="image-li" v-for="(i, index) in ask.img" :key="index"><img :src="$getImageUrl(i, 375, 375)" alt=""></div>
          </div>
        </div>
      </div>
      <div class="detail-body" v-if='ask.status === 0'>
        <div class="title"><label for=""><span>回复内容</span></label></div>
        <div class="content">
          <div class="text">
            <textarea v-model="answer.desc"></textarea>
            <div class="image">
              <div class="image-li" v-for="(i, index) in answer.img" :key="index"><img :src="i" alt=""></div>
            </div>
            <el-button type="info" :loading="uploading" @click="uploadimg" v-show="answer.img.length < 3">上传照片</el-button><input type="file" id='upload' @click.stop @change="upload($event)">
          </div>
        </div>
        <div class="btn">
          <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
        </div>
      </div>
      <div class="detail-body" v-else>
        <div class="title"><label for=""><span>回复内容</span></label></div>
        <div class="content">
          <div class="image">
            <div class="image-li" v-for="(i, index) in ans.img" :key="index"><img :src="$getImageUrl(i, 375, 375)" alt=""></div>
          </div>
          <p><span>{{ ans.desc }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Toast } from 'mint-ui';
  import * as qiniu from 'qiniu-js';
  export default {
    name: 'personalAnswerDetailM',
    data() {
      return {
        ask: {},
        ans: {},
        answer: {
          desc: '',
          img: []
        },
        uploading: false,
        loading: false
      }
    },
    mounted() {
      this.getMessage()
    },
    methods: {
      getMessage() {
        this.$ajax('/qa/detail/'+this.$route.params.id, {
          params: {
            user_id: localStorage.getItem('userid'),
            token: localStorage.getItem('token')
          }
        }).then(res => {
          if(res.data.result === 'success') {
            let msg = res.data.data;
            let img = [], ans_img = [];
            for(let i = 0; i < msg.ask_images.length; i ++) {
              img.push(msg.ask_images[i].file_path)
            }
            for(let i = 0; i < msg.answer_images.length; i ++) {
              ans_img.push(msg.answer_images[i].file_path)
            }
            this.ask = {
              name: this.$route.query.name,
              time: this.$route.query.time,
              title: msg.ask_title,
              desc: msg.ask_description,
              img: img,
              status: msg.ask_status,
              id: msg.id
            }
            this.ans = {
              desc: msg.answer_content,
              img: ans_img
            }
          }
        }).catch(error => {

        })
      },
      submit() {
        if(!this.answer.desc) {
          Toast('请输入回复内容！');
          return false;
        }
        this.loading = true;
        this.$ajax.post('/qa/asubmit', {
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token'),
          qid: this.ask.id,
          answer_content: this.answer.desc,
          img: this.getImageUrl(this.answer.img)
        }).then(res => {
          this.loading = false;
          if(res.data.result === 'success') {
            Toast('回复成功！');
            this.getMessage()
          }else {
            Toast(res.data.data.errmsg)
          }
        }).catch(error => {
          this.loading = false;
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
            _this.answer.img.push(newUrl)
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
.personal-answer-detail-m {
  width: 100%;
  .personal-answer-detail-main-m {
    position: relative;
    .detail-head {
      width: 100%;
      height: 45px;
      line-height: 45px;
      background: #fff;
      border: 1px solid #f4f4f4;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      .name {
        color: #ff9933;
      }
    }
    .detail-body {
      margin-top: 10px;
      background: #fff;
      padding: 0 10px;
      .title {
        line-height: 45px;
        label {
          color: #333;
          font-weight: bold;
          position: relative;
          padding-left: 10px;
          ::before {
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
      }
      .content {
        padding-bottom: 10px;
        h3 {
          color: #333;
        }
        .image {
          .image-li {
            text-align: center;
            padding: 5px 0;
            img {
              max-width: 100%;
            }
          }
        }
        .text {
          padding: 10px 20px;
          textarea {
            border: 1px solid #eee;
            width: 100%;
            height: 120px;
            resize: none;
            outline: none;
            padding: 10px;
            font-size: 14px;
            color: #666;
          }
          button {
            width: 100%;
            margin-top: 20px;
          }
          #upload {
            visibility: hidden;
          }
        }
      }
      .btn {
        border-top: 1px solid #eee;
        padding: 10px 0;
        button {
          width: 100%;
        }
      }
    }
  }
}
</style>
