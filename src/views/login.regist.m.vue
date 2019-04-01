<template>
<div class="login-regist-m">
  <div class="regist-main">
    <div class="regist-main-body">
      <div class="main-body-content">
        <el-form :model="registForm" ref="registForm" label-width="0" :rules="rules" >
          <el-form-item label="" prop="mobile" ref="registFormMobile">
            <el-input placeholder="请输入手机号" v-model.number="registForm.mobile"></el-input>
          </el-form-item>
          <el-form-item label="" prop="code" :rules="[{ required: true, message: '验证码不能为空'}]">
            <el-input class="code" maxlength="6" placeholder="请输入验证码" v-model="registForm.code"></el-input><el-button class="code-btn" type="primary" @click="codeButton.click &&  postCode()">{{ codeButton.value }}</el-button>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input placeholder="请输入密码" type="password" v-model="registForm.password"></el-input>
          </el-form-item>
          <el-form-item label="" prop="repassword">
            <el-input placeholder="请输入密码" type="password" v-model="registForm.repassword"></el-input>
          </el-form-item>
          <el-form-item label="" class="btn">
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
import { Toast } from 'mint-ui';
export default {
  name:'registM',
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
  props: ['pathParams', 'code'],
  mounted() {

  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$ajax.post('/user/register',{
            mobile: this.registForm.mobile,
            code: this.registForm.code,
            password: this.registForm.password,
            wxopenid: localStorage.getItem('openid')
          }).then((res) => {
            if(res.data.code === 1) {
              localStorage.setItem('token',res.data.data.token);
              localStorage.setItem('userid',res.data.data.user_id);
              Toast({ message: '恭喜您完成注册，马上开始在筑英台的学习之路吧！'});
              setTimeout(() => {
                this.$router.push(localStorage.getItem('path'))
              },1000)
            }else {
              Toast('注册失败' + res.data.message);
            }
          }).catch((error) => {
            if (error.response) {
              Toast('注册失败' + error.response.data.message);
            }
          })

        } else {
          Toast({ message: '请补全信息' });
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
              Toast({ message: '验证码发送给成功' });
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
              Toast({ message: res.data.message });
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
.login-regist-m {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
  .regist-main {
    display: flex;
    flex-direction: column;
    position: relative;
    .regist-main-body {
      background: #fff;
      border-radius: 4px;
      margin-top: 50px;
      .main-body-top {
        line-height: 80px;
        text-align: center;
        background: #fed900;
        color: #333;
        font-size: 24px;
      }
      .main-body-content {
        .el-form-item__content {
          display: flex;
          border-bottom: 1px solid #cfcfcf;
        }
        .btn .el-form-item__content {
          border: none;
        }
        .el-input {
          width: 100%;
          input {
            border: none;
          }
        }
        .el-input.code {
          margin-right: 10px;
        }
        .btn-regist {
          width: 100%;
          color: #333;
          margin-top: 50px;
        }
        .code-btn {
          width: 112px;
          text-align: center;
          padding: 8px 10px;
          height: 32px;
          color: #333;
        }
      }
    }
    .regist-main-bot {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin: 30px 0;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
}
</style>
