<template>
<div class="login-bg-m">
  <div class="login-log-m">
    <div class="log-main">
      <div class="log-main-head">
        <img src="../assets/mobile/LOGO@2x.png" width="110" alt="">
      </div>
      <div class="log-main-body">
        <div class="main-body-inner">
          <div class="input-box">
            <el-input v-model="mobile.value" class="icon-mobile" ref="mobile" placeholder="请输入手机号" @keyup.enter.native='login'></el-input>
          </div>
          <div class="input-box">
            <el-input v-model="password.value" class="icon-pass" ref="password" placeholder="请输入密码" type="password" @keyup.enter.native='login'></el-input>
          </div>
          <p>
            <router-link to="/m/login/regist"><span class="regist">立即注册</span></router-link>
            <router-link to="/m/login/forgetpassword"><span class="forget">忘记密码</span></router-link>
          </p>
          <div class="button-box"><el-button type="primary" @click="login">登录</el-button></div>
        </div>
      </div>
      <div class="log-main-bottom-m">
        <p><span>Copyright@筑英台 https://zyt.arctron.cn/ 沪ICP备17034208号</span></p>
        <p><span>公安备案号 31010602002396</span></p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { MessageBox } from 'mint-ui';
export default {
  name:'logM',
  data() {
    return {
      mobile: {
        value: '',
        focus: false
      },
      password: {
        value: '',
        focus: false
      },
      openid: ''
    }
  },
  mounted() {
    this.getOpenId()
  },
  props: ['pathParams', 'code'],
  methods: {
    login() {
      if(!this.mobile.value) {
        this.$refs.mobile.$el.querySelector('input').focus();
        return false;
      }
      if(!this.password.value) {
        this.$refs.password.$el.querySelector('input').focus();
        return false;
      }
      let mobileREG = /^[1][3,4,5,7,8][0-9]{9}$/;
      if(!mobileREG.test(this.mobile.value)){
        MessageBox('提示','您输入的手机号有误');
        this.$refs.mobile.$el.querySelector('input').focus();
        return false;
      }
      this.$ajax.post('/user/login',{
        mobile: this.mobile.value,
        password: this.password.value,
        wxopenid: localStorage.getItem('openid')
      }).then((res) => {
        // console.log(res);
        if(res.data.code === 1) {
          localStorage.setItem('token',res.data.data.token);
          localStorage.setItem('userid',res.data.data.user_id);
          MessageBox('提示','恭喜你，登录成功');
          setTimeout(() => {
            this.$router.push( localStorage.getItem('path') || '/m/personal' );
          },1000)
        }else {
          MessageBox('提示','登录失败，' + res.data.message);
        }
      }).catch((error) => {
        if (error.response) {
          MessageBox('提示','登录失败，' + error.response.data.message);
        }
      })

    },
    getOpenId() {
      if(this.code) {
        this.$ajax.get('/other/weixin?jscode='+this.code).then(res => {
          if(res.data.code === 1) {
            localStorage.setItem('openid', res.data.data.openid);
          }
        }).catch(error => {

        })
      }
    }
  }
}
</script>

<style lang='less'>
.login-bg-m {
  width: 100%;
  background:#62615f url('../assets/mobile/login-bj.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
}
.login-log-m {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .log-main {
    position: relative;
    height: 100%;
    .log-main-head {
      text-align: center;
      padding: 50px 0;
    }
    .log-main-body {
      width: 300px;
      border-radius: 4px;
      background: none;
      margin: 0 auto;
      .main-body-inner {
        h3 span {
          display: inline-block;
          line-height: 40px;
          border-bottom: 2px solid #fed900;
          color: #fff;
          margin-bottom: 20px;
        }
        .input-box {
          padding: 8px 0;
          .el-input {
            position: relative;
            .el-input__inner {
              background-color: rgba(0, 0, 0, 0.5);
              border: none;
              color: rgb(240, 240, 240);
              padding-left: 40px;
            }
          }
          .icon-mobile::before {
            background: url('../assets/mobile/icon1@3x.png') no-repeat 10px center;
            background-size: 20px 20px;
            content: '';
            width: 40px;
            height: 40px;
            display: inline-block;
            position: absolute;
            z-index: 1;
            left: 0;
            top: 0;
          }
          .icon-pass::before {
            background: url('../assets/mobile/icon2@3x.png') no-repeat 10px center;
            background-size: 20px 20px;
            content: '';
            width: 40px;
            height: 40px;
            display: inline-block;
            position: absolute;
            z-index: 1;
            left: 0;
            top: 0;
          }
        }
        p {
          .regist {
            color: #ffa142;
          }
          .forget {
            float:right;
            color: #fff;
          }
        }
        .button-box {
          padding: 30px 0;
          button {
            width: 100%;
            color: #333;
          }
        }
      }
    }
    .log-main-bottom-m {
      width: 100%;
      text-align: center;
      color: rgb(204, 204, 204);
      font-size: 12px;
      position: fixed;
      bottom: 0;
      p {
        font-size: 12px;
      }
    }
  }
}
</style>
