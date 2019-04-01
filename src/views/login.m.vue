<template>
<div class="login-main-m">
  <router-view :pathParams="pathParams" :code="code"></router-view>
</div>
</template>

<script>
const base64url = require('base64-url');
export default {
  name:'loginM',
  data() {
    return {
      pathParams: '',
      code: ''
    }
  },
  mounted() {
    // console.log(this.$route)
    this.pathParams = this.$pathFrom.fullPath;
  },
  created() {
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');
    const openid = localStorage.getItem('openid');
    let state = base64url.escape('/m/login');
    let wxurl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7a3600e1942e828b&response_type=code&scope=snsapi_base&state='+state+'&redirect_uri='+this.$host+'/ws.html#wechat_redirect'
    let href = window.location.href;
    if(this.$pathFrom.name) {
      localStorage.setItem('path', this.$pathFrom.fullPath)
    }
    let ua = navigator.userAgent.toLowerCase();
    if(ua.indexOf('micromessenger') != -1) {
      if (openid) {
        this.$ajax.post('/user/wxlogin',{
          wxopenid: openid
        }).then(res => {
          localStorage.setItem('token', res.data.data.token || '');
          localStorage.setItem('userid', res.data.data.user_id || '');
        }).catch(error => {

        })
      }else {
        if(href.indexOf('?') !== -1) {
          let params = href.split('?')[1];
          let code = '';
          if(params.indexOf('&') !== -1) {
            code = params.split('&')[0].split('=')[1];
            this.code = code;
          }
        }else {
          window.location.href = wxurl;
        }
      }
    }

  },
  methods: {
    encode(str) {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode('0x' + p1);
      }));
    }
  }

}
</script>

<style lang='less'>
.login-main-m {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
