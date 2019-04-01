<template>
<div class="login-regist">
  <div class="regist-main">
    <div class="regist-main-head">
      <div class="mian-head-img">
        <img src="../assets/LOGO_2.png" alt="">
      </div>
      <h4><span>已有账号，</span><router-link to="/login"><span class="login">马上登录</span></router-link><router-link to="/"><span class="home">返回首页</span></router-link></h4>
    </div>
    <div class="regist-main-body">
      <div class="main-body-top">
        <h4><span>注册</span></h4>
      </div>
      <div class="main-body-content">
        <el-form :model="registForm" ref="registForm" label-width="112px" :rules="rules" >
          <el-form-item label="手机号" prop="mobile" ref="registFormMobile">
            <el-input placeholder="请输入手机号" v-model.number="registForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" :rules="[{ required: true, message: '验证码不能为空'}]">
            <el-input placeholder="请输入验证码" v-model="registForm.code"></el-input><el-button class="code-btn" type="primary" @click="codeButton.click &&  postCode()">{{ codeButton.value }}</el-button>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input placeholder="请输入密码" type="password" v-model="registForm.password"></el-input>
          </el-form-item>
          <el-form-item label="重复密码" prop="repassword">
            <el-input placeholder="请输入密码" type="password" v-model="registForm.repassword"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="submitForm('registForm')" class="btn-regist">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="regist-main-bot">
      <span>Copyright@筑英台 https://zyt.arctron.cn/ 沪ICP备17034208号</span>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name:'regist',
  data() {
    var validatePass = (rule, value, callback) => {
      let numREG = /^(?![^a-zA-Z]+$)(?!\D+$)/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if(!numREG.test(this.registForm.password) || this.registForm.password.length < 6) {
          callback(new Error('密码需至少6位包含数字、字母'));
        }
        if (this.registForm.repassword !== '') {
          this.$refs.registForm.validateField('repassword');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      let mobileREG = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (value === '') {
        callback(new Error('手机号不能为空'));
      } else if (!mobileREG.test(this.registForm.mobile)) {
        callback(new Error('请输入正确的手机号!'));
      } else {
        callback();
      }
    };
    return {
      registForm: {
        mobile: '',
        code: '',
        password: '',
        repassword: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'blur' },
          { required: true, message: '密码不能为空' }
        ],
        repassword: [
          { validator: validatePass2, trigger: 'blur' },
          { required: true, message: '密码不能为空' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空'},
          { type: 'number', message: '手机号必须为数字值'},
          { validator: validateMobile, trigger: 'blur' }
        ]
      },
      codeButton: {
        value: '获取验证码',
        time: 60,
        click: true
      }
    }
  },
  props: ['pathParams'],
  mounted() {
    this.$NProgress.done()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax.post('/user/register',{
            mobile: this.registForm.mobile,
            code: this.registForm.code,
            password: this.registForm.password
          }).then((res) => {
            if(res.data.code === 1) {
              localStorage.setItem('token',res.data.data.token);
              localStorage.setItem('userid',res.data.data.user_id);
              this.$message({ message: '恭喜您完成注册，马上开始在筑英台的学习之路吧！', type: 'success' });
              setTimeout(() => {
                this.$router.push(this.pathParams)
              },1000)
            }else {
              this.$message.error('注册失败' + res.data.message);
            }
          }).catch((error) => {
            if (error.response) {
              this.$message.error('注册失败' + error.response.data.message);
            }
          })

        } else {
          this.$message({ message: '请补全信息', type: 'warning' });
          return false;
        }
      });
    },
    postCode() {
      this.$refs['registForm'].validateField('mobile',(valid) => {
        if(valid === '') {
          this.$ajax.post('/user/sendcode',{ mobile: this.registForm.mobile, smsType: 2 })
          .then((res) => {
            if(res.data.code === 1) {
              this.$message({ message: '验证码发送给成功', type: 'success' });
              let timer = setInterval(() => {
                this.codeButton.click = false;
                this.codeButton.time = this.codeButton.time - 1;
                this.codeButton.value = '重新发送(' + this.codeButton.time + ')';
                if(this.codeButton.time <= 0) {
                  this.codeButton.value = '获取验证码';
                  this.codeButton.click = true;
                  this.codeButton.time = 60;
                  clearInterval(timer);
                }
              },1000)
            }else {
              this.$message({ message: res.data.message, type: 'error' });
            }
          }).catch((error) => {
            console.log(error)
          })

        }
      })
    }
  }
}
</script>

<style lang='less'>
.login-regist {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .regist-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 900px;
    .regist-main-head {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      h4 {
        a {
          color: #ffa142;
          span.login {
            padding-right: 10px;
          }
          span.home {
            padding-left: 10px;
            border-left: 1px solid #ccc;
          }
        }
      }
    }
    .regist-main-body {
      background: #fff;
      border-radius: 4px;
      .main-body-top {
        line-height: 80px;
        text-align: center;
        background: #fed900;
        color: #333;
        font-size: 24px;
      }
      .main-body-content {
        padding: 60px 164px;
        .el-input {
          width: 336px;
          margin-right: 10px;
        }
        .btn-regist {
          width: 336px;
        }
        .code-btn {
          width: 112px;
          text-align: center;
          padding: 12px 10px;
        }
      }
    }
    .regist-main-bot {
      text-align: center;
      font-size: 12px;
      color: #333;
      margin: 30px 0;
    }
  }
}
</style>
