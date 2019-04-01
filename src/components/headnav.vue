<template>
  <div class="zyt-head">
    <div class="zyt-head-content">
      <div class="head-left">
        <router-link to="/"><img src="../assets/logo-zyt.png" alt="logo"></router-link>
      </div>
      <div class="head-mid">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" text-color="#333" active-text-color="#333" router>
          <el-menu-item index="1" route="/">首页</el-menu-item>
          <el-menu-item index="2" route="/train">培训</el-menu-item>
          <el-menu-item index="3" route="/expert">专家咨询</el-menu-item>
          <!-- <el-submenu index="4">
            <template slot="title">内容服务</template>
            <el-menu-item index="4-1" route="/content/news">新闻资讯</el-menu-item>
            <el-menu-item index="4-2" route="/content/files">文档标准</el-menu-item>
            <el-menu-item index="4-3" route="/content/works">作品馆</el-menu-item>
          </el-submenu> -->
          <el-menu-item index="5" route="/activity">活动中心</el-menu-item>
        </el-menu>
      </div>
      <div class="head-right">
        <div class="personal-message" v-if="islogin">
          <div class="notify">
            <div class="notify-image">
              <el-badge :value="noread" :max="99" class="item" v-if="noread > 0">
                <el-button size="small" @click="showMessage()"></el-button>
              </el-badge>
              <el-badge :max="99" class="item" v-else>
                <el-button size="small" @click="showMessage()"></el-button>
              </el-badge>
            </div>
          </div>
          <div class="user-image">
            <div class="image-box">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link" :style="{'background-image': 'url('+avatar+')'}"></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command='personal'>个人中心</el-dropdown-item>
                  <el-dropdown-item command='logout'>退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div v-else>
          <router-link to="/login"><span class="head-btn head-btn-first">登录</span></router-link>
          <router-link to="/login/regist"><span class="head-btn">注册</span></router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const defaultIamgeUser = require('../assets/defaultuser.jpg');
import Vue from 'vue';
import notify from '@/components/notify';
export default {
  name: 'headnav',
  data() {
    return {
      activeIndex: '',
      islogin: false,
      avatar: defaultIamgeUser,
      saveMessage: '',
      notify: [],
      noread: 0,
      professor_status:'',
      p: 1,
      l: 5
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    getActiveIndex() {
      let routeName = this.$router.history.current.name
      let path = this.$router.history.current.path
      let indexName = path.split('/') ? path.split('/')[1] : path
      switch(indexName) {
        case 'train':
          this.activeIndex = '2'
          break;
        case 'expert':
          this.activeIndex = '3'
          break;
        case 'content':
          this.activeIndex = ( routeName === 'news' ? '4-1' : ( routeName === 'files' ? '4-2' : '4-3' ) )
          break;
        case 'activity':
          this.activeIndex = '5'
          break;
        case 'personal':
          this.activeIndex = '6'
          break;
        default:
          this.activeIndex = '1'
      }
    },
    isLogin() {
      const token = localStorage.getItem('token');
      const userid = localStorage.getItem('userid');
      if(token && userid) {
        this.islogin = true;
        this.$ajax('/user/detail/'+userid,{
          params: {
            user_id: localStorage.getItem('userid'),
            token: localStorage.getItem('token')
          }
        }).then((res) => {
          this.avatar = res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar, 50, 50) : defaultIamgeUser;
          this.noread = res.data.data.no_read_msg;
          this.professor_status=res.data.data.professor_status;
          this.expertinfo_phone=res.data.data.phone;
          Event.$emit('judgeExpert',this.professor_status);
          Event.$emit('userphone',this.expertinfo_phone);
        }).catch(() => {
          this.islogin = false;
          if(this.$route.path && this.$route.path.split('/') && this.$route.path.split('/')[1] === 'personal') {
            this.$router.push('/login')
          }
        })
      }else {
        this.islogin = false;
        if(this.$route.path && this.$route.path.split('/') && this.$route.path.split('/')[1] === 'personal') {
          this.$router.push('/login')
        }
      }
    },
    showMessage() {
      this.createNotify()
    },
    createNotify() {
      let ndiv = document.createElement('div');
      ndiv.setAttribute('id','notify');
      document.body.appendChild(ndiv);
      const _this = this;
      let Notify = Vue.extend({
        data() {
          return {
            noread: _this.noread
          }
        },
        components: {
          notify
        },
        template: `<notify @link="this.link" @closeNotify="this.closeNotify" @read="this.read" :noread="this.noread"></notify>`,
        methods: {
          link(url) {
            _this.$router.push(url)
          },
          closeNotify() {
            setTimeout(() => {
              document.body.removeChild(document.getElementById('notify'))
            },150)
          },
          read(num) {
            _this.noread = num;
          }
        }
      });
      new Notify().$mount('#notify');
    },
    logout() {
      localStorage.setItem('token','');
      localStorage.setItem('userid','');
      this.$message({ message: '退出登录成功', type: 'success' });
      setTimeout(() => {
        this.$router.push('/');
        this.isLogin();
      },1000)
    },
    handleCommand(command) {
      if(command === 'personal') {
        this.$router.push('/personal')
      }
      if(command === 'logout') {
        this.logout()
      }
    }
  },
  mounted() {
    this.getActiveIndex()
    this.isLogin()
    Event.$on('saveMessage',(res) => {
      this.isLogin()
    })
  },
  watch: {
    $route(val,oldval) {
      this.getActiveIndex()
      this.isLogin()
    }
  }
}
</script>

<style lang="less">
.el-header{
  padding: 0!important;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 20;
  transform: translateY(0);
  transition: transform 0.3s ease;
}
.el-menu {
  background-color: #fed900!important;
}
.zyt-head{
  padding:0 16px;
  background-color: #fed900;
  display: flex;
  justify-content:center;
  .zyt-head-content{
    width: 1380px;
    height: 57px;
    display: flex;
    flex-direction: row;
    .head-left {
      display: flex;
      line-height: 57px;
      flex-grow: 4;
      a {
        display: flex;
        flex-direction: column;
        justify-content:center;
      }
    }
    .head-mid{
      display: flex;
      flex-grow: 8;
      min-width: 444px;
      .el-menu--horizontal{
        border-bottom: 0!important;
      }
      .el-menu--horizontal > .el-menu-item,.el-menu--horizontal > .el-submenu .el-submenu__title{
        height: 57px;
        line-height: 57px;
        border-bottom: 0!important;
      }
      .el-menu--horizontal > .el-menu-item:hover{
        color: #666!important;
        background-color: #fed900;
      }
      .el-menu--horizontal > .el-menu-item.is-active,.el-menu--horizontal > .el-submenu.is-active .el-submenu__title{
        background-color: #333;
        font-weight: bold;
        color: #fed900!important;
      }
    }
    .head-right {
      display: flex;
      line-height: 57px;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      flex-grow: 1;
      min-width: 141px;
      a:hover .head-btn{
        color: #333;
      }
      a:nth-child(1)::after {
        content: '|';
        height: 14px;
        color: rgb(153, 153, 153);
      }
      .head-btn {
        font-size: 14px;
        color: rgb(153, 153, 153);
        padding: 0 20px;
        transition: background-color .3s, color .3s;
      }
      .personal-message {
        display: flex;
        .notify {
          display: flex;
          flex-direction: column;
          justify-content: center;
          .notify-image {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            .el-badge {
              display: flex;
              button {
                background-image: url('../assets/Shape11.png');
                background-repeat: no-repeat;
                background-position: center center;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                padding: 0;
                border: none;
                background-color: #fed900;
              }
              .el-badge__content {
                background: #ff3333;
                top: 6px;
                right: 18px;
                color: #333;
                border: none;
              }
            }
          }
        }
        .user-image {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 30px;
          .image-box {
            width: 36px;
            height: 36px;
            .el-dropdown {
              height: 36px;
              .el-dropdown-link {
                display: inline-block;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background-image: url('../assets/defaultuser.jpg');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 100% 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>

