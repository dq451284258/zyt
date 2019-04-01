<template>
  <div class="card-moudle">
    <div class="card-moudle-main">
      <div class="card-moudle-content">
        <div class="card-box">
          <div class="card-item">
            <vue-scroll :ops="ops" ref="vs">
              <div class="card-item-mask"></div>
              <personalCardM :userid="userid" :fullWidth="279"></personalCardM>
            </vue-scroll>
          </div>
        </div>
        <div class="card-share">
          <div class="card-share-top">
            <div class="text">
              <h4 class="h4"><span>扫一扫，分享给朋友！</span></h4>
              <div class="qrcode-box"><qriously id="qrcode" :value="qrcode.value" :size="qrcode.size" :backgroundAlpha="qrcode.backgroundAlpha"/></div>
              <div class="share-box"><share :config="shareConfig"></share></div>
            </div>
            <div class="copy"><button v-clipboard:copy="link" v-clipboard:success="onCopy">复制链接</button></div>
          </div>
          <div class="card-share-bot">
            <div class="showcode">
              <el-switch v-model="isShowCode"></el-switch>将二维码展示在个人中心页面中
            </div>
            <el-button type="primary" class="download" @click="saveCard">下载二维码</el-button>
            <el-button type="info" class="close" @click="close">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import personalCardM from '@/views/personal.card.m';
  import Vue from 'vue';
  import VueClipboard from 'vue-clipboard2';
  Vue.use(VueClipboard);
  import html2canvas from 'html2canvas';
  export default {
    name: 'cardMoudle',
    props: ['userid', 'showCard'],
    data() {
      return {
        link: '',
        ops: {
          bar: {
            background: '#c1c1c1'
          }
        },
        qrcode: {
          value: this.$host+'/#/m/personal/card/'+this.userid,
          size: 176,
          backgroundAlpha: 1
        },
        shareConfig: {
          url: this.$host+'/#/m/personal/card/'+this.userid,
          source: '',
          title: '',
          description: '',
          image: '',
          sites: ['wechat','qq', 'weibo'],
          wechatQrcodeTitle: '微信扫一扫：分享',
          wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>'
        },
        isShowCode: false,
        showimg: ''
      }
    },
    mounted() {
      this.link = this.$host+'/#/m/personal/card/'+this.userid;
    },
    components: {
      personalCardM
    },
    watch: {
      "isShowCode"() {
        this.submit()
      }
    },
    methods: {
      onCopy() {
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      },
      close() {
        this.$emit('showCard')
      },
      saveCard () {
        html2canvas(document.querySelector("#qrcode"), {scale:2,logging:false,useCORS:true}).then(canvas => {
          var type = 'png';
          var imgData = canvas.toDataURL(type);
          this.showimg = imgData;
          let a = document.createElement('a');
          a.setAttribute('href', imgData);
          a.setAttribute('download', 'image');
          a.click()
        });
      },
      submit() {
        this.$ajax.post('/user/edit',{
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token'),
          savedata: {
            ecard_show: this.isShowCode ? 1 : 0
          },
          t: 'ecard'
        }).then(res => {
          if(res.data.result === 'success') {
            localStorage.setItem('token',res.data.data.token)
          }else {
            this.$message.error(res.data.data.errmsg)
          }
        }).catch(error => {

        })
      },
      getStatus(status) {
        this.isShowCode = status === 1 ? true : false
      }
    }
  }
</script>

<style lang='less'>
.card-moudle {
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  .card-moudle-main {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    .card-moudle-content {
      display: flex;
      justify-content: center;
      .card-box {
        .card-item {
          width: 375px;
          height: 667px;
          background: url('../assets/mobile/card-mobile.png') no-repeat center center;
          background-size: 90% 100%;
          padding: 80px 46px 90px 50px;
          position: relative;
          .card-item-mask {
            position: absolute;
            z-index: 1;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
          }
        }
      }
      .card-share {
        margin-left: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .card-share-top {
          background: #fff;
          border-radius: 4px;
          .text {
            padding: 10px 20px;
            .h4 {
              line-height: 40px;
            }
            .qrcode-box {
              border: 1px solid #ccc;
              border-radius: 4px;
              padding: 10px;
              text-align: center;
            }
            .share-box {
              padding-top: 10px;
              text-align: center;
            }
          }
          .copy {
            line-height: 50px;
            border-top: 1px solid #ccc;
            text-align: center;
            button {
              outline: none;
              border: none;
              background: none;
              cursor: pointer;
            }
          }
        }
        .card-share-bot {
          .showcode {
            background: #fff;
            border-radius: 4px;
            line-height: 50px;
            margin-top: 20px;
            font-size: 12px;
            padding-left: 10px;
          }
          .download {
            height: 50px;
            margin-top: 20px;
            width: 100%;
          }
          .close {
            height: 50px;
            margin-top: 20px;
            width: 100%;
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>
