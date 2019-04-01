<template>
  <div id="app" :class="{'app-login':loginMoudule}">
    <div v-if="mobile" class="app-mobile">
      <router-view />
    </div>
    <vue-scroll :ops="ops" ref="vs" v-else>
      <el-container>
        <el-header height="57px" v-show="!loginMoudule">
          <headnav :saveMessage="saveMessage"></headnav>
        </el-header>
        <el-main :style="{'min-height':mainMinHeight,'height':mainHeight}">
          <router-view :tabScrollTop="tabScrollTop" :mainHeight="mainMinHeight" />
        </el-main>
        <el-footer height="232px" v-show="!loginMoudule">
          <footbar></footbar>
        </el-footer>
      </el-container>
    </vue-scroll>
  </div>
</template>

<script>
import headnav from "@/components/headnav"
import footbar from "@/components/footbar"
import Vue from 'vue'
Event = new Vue()

export default {
  name: 'App',
  data() {
    return {
      mainMinHeight: '',
      fullHeight: document.documentElement.clientHeight,
      ops: {
        bar: {
          background: '#c1c1c1'
        }
      },
      tabScrollTop: '',
      loginMoudule: false,
      mainHeight: 'auto',
      mobile: this.$isMobile,
      saveMessage: ''
    }
  },
  components: {
    headnav,
    footbar
  },
  mounted() {
    if(this.$route.path.indexOf('/m/') !== -1) {
      this.mobile = true;
    }
    this.handleResize()
    window.onresize = () => {
      this.handleResize()
    }
    Event.$on('tabScrollTop',(top) => {
      this.scrollTo(top)
    })
  },
  methods: {
    handleResize() {
      this.fullHeight = document.documentElement.clientHeight
      if(this.loginMoudule) {
        this.mainMinHeight = this.fullHeight + 'px'
        this.mainHeight = this.mainMinHeight
      }else{
        this.mainMinHeight = this.fullHeight - 57 - 232 + 'px'
        this.mainHeight = 'auto'
      }
    },
    scrollTo(y) {
      this.$refs['vs'].scrollTo({
        x: 0,
        y: y
      })
    }
  },
  watch: {
    $route(val,oldval) {
      if(!this.mobile) {
        this.scrollTo(0)
      }
      if(val.name === 'login' || val.name === 'regist' || val.name === 'forgetpassword') {
        this.loginMoudule = true
      }else{
        this.loginMoudule = false
      }
    },
    loginMoudule(val,oldval) {
      this.handleResize()
    }
  },
  created() {
    if(this.$router.history.current.name === 'login' || this.$router.history.current.name === 'regist' || this.$router.history.current.name === 'forgetpassword') {
      this.loginMoudule = true
    }else {
      this.loginMoudule = false
    }
    const openid = localStorage.getItem('openid');
    if(openid) {
      this.$ajax.post('/user/wxlogin',{
        wxopenid: openid
      }).then(res => {
        localStorage.setItem('token', res.data.data.token);
        localStorage.setItem('userid', res.data.data.user_id);
      }).catch(error => {

      })
    }
  }
}
</script>

<style lang='less'>
#app {
  font-family: 'Microsoft Yahei';
  position: relative;
  font-size: 14px;
  color: #999;
  width: 100%;
  height: 100%;
  #app-scroll,.el-container {
    width: 100%;
    height: 100%;
  }
}
html,body {
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  width: 100%;
  height: 100%;
}
* {
  box-sizing: border-box;
}
ul {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
}
a {
  text-decoration: none;
  color: #666;
}
h1,h2,h3,h4 {
  font-weight: normal;
  margin: 0;
}
.app-mobile {
  height: 100%;
  width: 100%;
  max-width: 677px;
  margin: 0 auto;
}
#nprogress .bar{
  background: #333!important;
  z-index: 2031!important;
}
#nprogress .peg{
  -webkit-box-shadow: 0 0 10px #333, 0 0 5px #333!important;
  box-shadow: 0 0 10px #333, 0 0 5px #333!important;
}
.el-main{
  padding:0!important;
  overflow: hidden!important;
  position: relative;
}
.el-container {
  padding-top: 57px;
}
.app-login .el-container {
  padding-top: 0;
}
</style>
