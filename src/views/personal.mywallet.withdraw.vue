<template>
  <div class="withdraw">
    <div class="alipay-number" v-if='!bounded'>
      <span class="alipay-number-name">支付宝账号：</span>
      <span class='nobound'>未绑定</span>
      <span class='tobound' @click='toAlipay()'>去绑定>></span>
      <div class='toattention'>请先绑定支付宝账号后，再进行提现。</div>
    </div>
    <el-dialog title="我的钱包" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="支付宝账号" :label-width="formLabelWidth">
          <el-input v-model="form.alipay" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" class='sendcode'>
          <el-input v-model="form.code" auto-complete="off"></el-input>
          <!-- <el-button type="primary" @click="checkMobile">发送验证码</el-button> -->
          <el-button class="code-btn" type="primary" @click="codeButton.click &&  checkMobile(1)">{{ codeButton.value }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" :loading="surebound" @click="toboundalipay" v-html='sureboundtext'></el-button>
      </div>
    </el-dialog>

    <div class="alipay-number-topay" v-if='bounded'>
      <span class="alipay-number-name">支付宝账号：</span>
      <span class='nobound' v-text='oldapliay'></span>
      <span class='tobound'  @click='toAlipay()'>修改>></span>
      <div class="alipay-number-new">
        <span class="alipay-number-new-title">提现金额</span>
        <el-input v-model="topupnumber" placeholder="请输入金额" class='alipay-number-new-input'></el-input>
        <span class='money-unit'>元</span>
        <el-button type="primary" @click="suretopup()">确定提现</el-button>
      </div>
      <div class='toattention'>提交申请后，预计48小时内到账</div>
      <div class="topupsuccess" v-if='ifsuccess'>
        <img src="../assets/cgtjsq.png" alt="">
        <div class="successtext">成功提交申请！</div>
      </div>
    </div>
    <el-dialog title="我的钱包" :visible.sync="tocheckmobile">
      <el-form :model="form">
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" class='sendcode'>
          <el-input v-model="form.code" auto-complete="off"></el-input>
          <el-button class="code-btn" type="primary" @click="codeButton.click &&  checkMobile(2)">{{ codeButton.value }}</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tocheckmobile = false">取 消</el-button>
        <el-button type="primary" :loading="loadshow" @click="toapymoneycheck" v-html='surepaytext'></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'withdraw',
  data () {
    return {
      dialogFormVisible:false,
      form: {
        alipay: '',
        mobile: '',
        code: ''
      },
      formLabelWidth:'120px',
      newnumber:'',//新账号
      topupnumber:'',//提现金额
      bounded:false,
      tocheckmobile:false,//去提现的发送验证码弹窗是否显示
      codeButton: {
        value: '获取验证码',
        time: 60,
        click: true
      },
      ifsuccess:false,
      loadshow:false,
      surepaytext:'确定',
      surebound:false,
      sureboundtext:'确定',
      paystatus:'',
      timer:'',
      balance:'',
      oldapliay:''
    }
  },
  watch: {
    '$route' (to, from) {
      this.paystatus=this.$route.query.status;
      this.account();
    },
  },
  mounted () {
    //处理vue-router的ie兼容问题
    if(this.checkIE()){
      window.addEventListener('hashchange', () => {
          var currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
          this.$router.push(currentPath)
        }
      }, false)
    }
    this.paystatus=this.$route.query.status;
    Event.$on('userphone',(res) => {
      this.form.mobile=res;
    });
    this.account();
  },
  methods:{
    //处理vue-router的ie兼容问题
    checkIE(){
      return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
    },
    //去绑定
    toAlipay(){
      this.dialogFormVisible=true;
    },
    //发送验证码
    checkMobile(type){
      if(this.form.mobile!==''){
        let mobileREG = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!mobileREG.test(this.form.mobile)) {
          this.$alert('电话号码格式不正确', '提示', {
            confirmButtonText: '确定'
          });
          return false;
        }
        let userid= localStorage.getItem("userid");
        let token= localStorage.getItem("token");
        this.$ajax({
          method: 'post',
          url: '/other/code',
          data:{
            "mobile":this.form.mobile,
            "smsType":type
          },
          contentType: "application/json",
        })
        .then((res) => {
          this.$NProgress.done();
          this.$message({ message: '验证码发送成功', type: 'success' });
          if(res.data.code === 1) {
              this.timer = setInterval(() => {
                this.codeButton.click = false;
                this.codeButton.time = this.codeButton.time - 1;
                this.codeButton.value = '重新发送(' + this.codeButton.time + ')';
                if(this.codeButton.time <= 0) {
                  this.codeButton.value = '获取验证码';
                  this.codeButton.click = true;
                  this.codeButton.time = 60;
                  clearInterval(this.timer);
                }
              },1000)
          }else {
              this.$message({ message: res.data.message, type: 'error' });
            }
        })
        .catch((res) => {
          this.$alert(res.data.data.errmsg, '提示', {
            confirmButtonText: '确定'
          });
        });
      }else{
        this.$alert('电话号码不能为空', '提示', {
            confirmButtonText: '确定'
          });
      }
      
    },
    //确定绑定支付宝
    toboundalipay(){
      this.sureboundtext=`<i class="el-icon-loading"></i>加载中`;
      this.surebound=true;
      if(this.form.alipay==''){
        this.$alert('支付宝账号不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.sureboundtext='确定';
            this.surebound=false;
          }
        });
        return false;
      }
      if(this.form.code==''){
        this.$alert('验证码不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.sureboundtext='确定';
            this.surebound=false;
          }
        });
        return false;
      }
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/bindwithdrawacc',
        data:{
          "user_id":userid,
          "token":token,
          "withdraw_acc":this.form.alipay,
          "code":this.form.code
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        this.codeButton.value = '获取验证码';
        this.form.code='';
        this.codeButton.click = true;
        this.codeButton.time = 60;
        clearInterval(this.timer);
        if(res.data.result=='success'){
          this.dialogFormVisible = false;
          this.bounded=true;
          this.sureboundtext='确定';
          this.surebound=false;
          this.$message({
            type: 'success',
            message: '支付宝绑定成功！'
          });
          // this.account();
          this.oldapliay=this.form.alipay
        }else{
          this.$alert(res.data.data.errmsg, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.sureboundtext='确定';
              this.surebound=false;
            }
          });
        }
        
      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.sureboundtext='确定';
            this.surebound=false;
          }
        });
      });
    },
    //确定提现
    suretopup(){
      let re = /^[0-9]+.?[0-9]*$/;
      if(!re.test(this.topupnumber)){
        this.$alert('输入金额不正确', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.surepaytext='确定';
            this.loadshow=false;
          }
        });
        return false;
      }
      if(this.topupnumber>this.balance){
        this.$alert('输入金额不能超过余额，请重新输入金额', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.surepaytext='确定';
            this.loadshow=false;
          }
        });
        return false;
      }
      if(this.topupnumber<0.1){
        this.$alert('输入金额不能小于0.1元，请重新输入金额', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.surepaytext='确定';
            this.loadshow=false;
          }
        });
        return false;
      }
      this.tocheckmobile=true;
      this.ifsuccess=false;
    },
    toapymoneycheck(){
      this.surepaytext=`<i class="el-icon-loading"></i>加载中`;
      this.loadshow=true;
      if(this.form.code==''){
        this.$alert('验证码不能为空', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.surepaytext='确定';
            this.loadshow=false;
          }
        });
        return false;
      }
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/withdraw',
        data:{
          "user_id":userid,
          "token":token,
          "amount":this.topupnumber,
          "code":this.form.code
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.codeButton.value = '获取验证码';
        this.form.code='';
        this.codeButton.click = true;
        this.codeButton.time = 60;
        clearInterval(this.timer);
        this.$NProgress.done();
        if(res.data.result=='success'){
          if(window.location.href.split('?')[1]){
            // window.location.href=window.location.href.split('?')[0]+'?status=1';
            window.location.reload();
          }else{
            window.location.href=window.location.href+'?status=1';
          }
          this.tocheckmobile=false;
          // this.ifsuccess=true;
          this.surepaytext='确定';
          this.loadshow=false;
        }else{
          this.$alert(res.data.data.errmsg, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.surepaytext='确定';
              this.loadshow=false;
            }
          });
        }
        
      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.surepaytext='确定';
            this.loadshow=false;
          }
        });
      });
    },
    account(){
      if(this.paystatus){
        if(this.paystatus==1){
          this.ifsuccess=true;
        }else{
          this.ifsuccess=false;
        }
      }
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/myaccount',
        data:{
          "user_id":userid,
          "token":token
        },
        contentType: "application/json",
      })
      .then((res) => {
        localStorage.setItem('token',res.data.token);
        this.$NProgress.done();
        this.bounded=res.data.data.withdraw_account?true:false;
        this.form.alipay=res.data.data.withdraw_account;
        this.oldapliay=res.data.data.withdraw_account;
        this.balance=res.data.data.balance;
      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.withdraw{
  padding-top: 32px;
  .el-dialog{
    width: 710px;
    padding-left: 200px;
  }
  .el-input{
    width: 350px;
  }
  .el-button{
    width: 116px;
  }
  .el-form-item{
    margin-left: 60px;
  }
  .el-dialog__footer{
    padding-right: 220px!important;
  }
  .sendcode{
    .el-input{
      width: 230px;
    }
  }
  .el-form-item__content{
    display: flex!important;
  }
  
  .alipay-number{
    font-size: 16px;
    color: #333;
    .tobound{
      margin-left: 20px;
      color: #ff9000;
      font-size: 14px;
      cursor: pointer;
    }
    .toattention{
      margin-top: 15px;
      font-size: 14px;
      color: #999999;
    }
  }
  .alipay-number-topay{
    font-size: 16px;
    color: #333;
    .topupsuccess{
      text-align: center;
      margin-top: 40px;
      margin-bottom: 90px;
      .successtext{
        font-size: 16px;
        font-weight: 700;
        color: #333;
        margin-left: 23px;
        margin-top: 10px;
      }
    }
    .tobound{
      margin-left: 20px;
      color: #ff9000;
      font-size: 14px;
      cursor: pointer;
    }
    .toattention{
      margin-top: 15px;
      font-size: 14px;
      color: #999999;
      margin-left: 20px;
    }
    .alipay-number-new{
      display: flex;
      margin-top: 20px;
      .money-unit{
        line-height: 42px;
        margin-right: 30px;
      }
      .alipay-number-new-title{
        width: 85px;
        line-height: 42px;
        text-align: right;
        margin-right: 12px;
      }
      .alipay-number-new-input{
        width: 200px;
        height: 42px;
        margin-right: 10px;
      }
    }
  }
}
</style>
