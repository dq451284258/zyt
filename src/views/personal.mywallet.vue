<template>
  <div class="personalWallet">
    <div class="wallet-title">我的钱包</div>
    <div class="wallect-info">
      <div class="wallect-info-base">
        <div class='balance-title'>账户余额：<span class='balance-number'>￥{{balance}}</span></div>
        <div class="income-expend">
          <span class='income-title'>累计收入：</span><span class="income-number">￥{{totalincome}}</span>
          <!-- <span class='expend-title'>累计收入：</span><span class="expend-number">￥{{expend}}</span> -->
        </div>
      </div>
      <div class="wallect-info-operator">
        <!-- <el-button type="primary">提现</el-button> -->
        <router-link :to="{path:'/personal/mywallet/withdraw'}" class='quiz-expert-price-edit'><el-button type="primary">提现</el-button></router-link>
        <router-link :to="{path:'/personal/mywallet/topup'}" class='quiz-expert-price-edit'><el-button type="primary">充值</el-button></router-link>
      </div>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'personalWallet',
  data () {
    return {
      balance:'',
      income:'',
      expend:'',
      totalincome:''
    }
  },
  mounted () {
    // console.log(this.$router)
    this.account();
  },
  watch: {
    '$route' (to, from) {
      this.account();
    },
  },
  methods:{
    changpage(){

    },
    account(){
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
        this.balance=res.data.data.balance;
        this.totalincome=res.data.data.income;
        Event.$emit('ifalipay',res.data.data.withdraw_account);
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
.personalWallet{
  padding: 0px 20px 0 32px;
  .page{
    margin: 20px 0;
    display: flex;
    justify-content:center;
    .el-pagination{
      display: inline-block;
    }
  }
  .wallet-title{
    font-size: 16px;
    font-weight: 700;
    color: #2f2e2e;
    line-height: 75px;
    margin-right: 30px;
    position: relative;
    width: 70px;
  }
  .wallet-title:before{
    content:'';
    width: 4px;
    height: 12px;
    background: #fed900;
    position: absolute;
    top: 32px;
    left: -32px;
  }
  .wallect-info{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f4f4f4;
    .wallect-info-base{
      font-size: 14px;
      padding-bottom: 18px;
      .balance-title{
        line-height: 45px;
        color: #333;
        .balance-number{
          font-size: 24px;
          color: #ff9000;
        }
      }
      .income-expend{
        color: #999;
        line-height: 57px;
      }
    }
  }
  
}
</style>
