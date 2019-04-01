<template>
<div class="login-bg">
  <div class="login-log">
    <div class="log-main">
      <div class="log-main-head">
        <img src="../assets/login_logo1.png" alt="">
      </div>
      <div class="log-main-body">
        <div class="main-body-inner">
          <h3><span>密码登录</span></h3>
          <div class="input-box">
            <el-input v-model="mobile.value" ref="mobile" placeholder="请输入手机号" @keyup.enter.native='login'></el-input>
          </div>
          <div class="input-box">
            <el-input v-model="password.value" ref="password" placeholder="请输入密码" type="password" @keyup.enter.native='login'></el-input>
          </div>
          <p>
            <span>没有账号，</span>
            <router-link to="/login/regist"><span class="regist">立即注册</span></router-link>
            <router-link to="/login/forgetpassword"><span class="forget">忘记密码</span></router-link>
          </p>
          <div class="button-box"><el-button type="primary" @click="login">登录</el-button></div>
        </div>
      </div>
      <div class="log-main-bottom">
        <p><span>Copyright@筑英台 https://zyt.arctron.cn/ 沪ICP备17034208号</span></p>
        <p><span>公安备案号 31010602002396</span></p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name:'log',
  data() {
    return {
      mobile: {
        value: '',
        focus: false
      },
      password: {
        value: '',
        focus: false
      }
    }
  },
  props: ['pathParams'],
  mounted() {
    this.$NProgress.done()
  },
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
        this.$message.error('您输入的手机号有误');
        this.$refs.mobile.$el.querySelector('input').focus();
        return false;
      }
      this.$ajax.post('/user/login',{
        mobile: this.mobile.value,
        password: this.password.value
      }).then((res) => {
        // console.log(res);
        if(res.data.code === 1) {
          localStorage.setItem('token',res.data.data.token);
          localStorage.setItem('userid',res.data.data.user_id);
          this.$message({ message: '恭喜你，登录成功', type: 'success' });
          setTimeout(() => {
            this.$router.push(this.pathParams)
          },1000)
        }else {
          this.$message.error('登录失败' + res.data.message);
        }
      }).catch((error) => {
        if (error.response) {
          this.$message.error('登录失败' + error.response.data.message);
        }
      })

    }
  }
}
</script>

<style lang='less'>
.login-bg {
  width: 100%;
  background:#62615f url('../assets/login_bg.png') no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
}
.login-log {
  width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .log-main {
    .log-main-head {
      text-align: center;
      padding: 40px 0;
    }
    .log-main-body {
      border-radius: 4px;
      background: #fff;
      padding: 30px;
      .main-body-inner {
        h3 span {
          display: inline-block;
          line-height: 40px;
          border-bottom: 2px solid #fed900;
          color: #333;
          margin-bottom: 20px;
        }
        .input-box {
          padding: 15px 0;
        }
        p {
          .regist {
            color: #ffa142;
          }
          .forget {
            float:right;
          }
        }
        .button-box {
          padding: 30px 0;
          button {
            width: 100%;
          }
        }
      }
    }
    .log-main-bottom {
      text-align: center;
      color: #fff;
      font-size: 12px;
      margin-top: 20px;
    }
  }
}
</style>
