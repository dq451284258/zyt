<template>
  <div class="topUp">
    <div class="inputcount">
        <span class='topup-title'>充值金额</span>
        <el-input v-model="topupaCount" placeholder="请输入金额"></el-input>
    </div>
    <div class="inputcount">
        <span class='topup-title'>充值方式</span>
        <el-radio v-model="chooseMethod" label="1">
            <img src="../assets/zhifubao.png" alt="">
        </el-radio>
    </div>
    <div class="topupButton" v-if='!ifsuccess'>
        <el-button type="primary" @click='totopup' v-html='loadtext' :loading="loadshow"></el-button>
    </div>
    <div class="topupsuccess" v-if='ifsuccess'>
        <img src="../assets/cgcz.png" alt="">
        <div class="successtext">成功充值{{successnum}}元！</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'topUp',
  data () {
    return {
      topupaCount:'',
      chooseMethod:'',
      paychannel:'',
      ifsuccess:false,
      paystatus:'',
      successnum:'',
      loadshow:false,
      loadtext:'去充值'
    }
  },
  watch: {
    '$route' (to, from) {
      this.paystatus=this.$route.query.status;
      this.judgeststus();
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
    this.judgeststus();
  },
  methods:{
      //处理vue-router的ie兼容问题
      checkIE(){
        return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
      },
      judgeststus(){
          if(this.paystatus){
              if(this.paystatus!==''){
                  this.ifsuccess=true;
                  this.successnum=this.paystatus;
              }
          }
      },
      totopup(){
        let re = /^[0-9]+.?[0-9]*$/;
        if(!re.test(this.topupaCount)){
            this.$alert('输入金额不正确', '提示', {
                confirmButtonText: '确定'
            });
            return false;
        }
        if(this.topupaCount<=0){
            this.$alert('充值金额不能少于0元', '提示', {
                confirmButtonText: '确定'
            });
            return false;
        }
        if(this.chooseMethod==''){
            this.$alert('请选择支付方式', '提示', {
                confirmButtonText: '确定'
            });
            return false;
        }else{
            this.$confirm('你确定去充值?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                let system ={};  
                let p = navigator.platform;       
                system.win = p.indexOf("Win") == 0;  
                system.mac = p.indexOf("Mac") == 0;  
                system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);     
                if(system.win||system.mac||system.xll){//如果是电脑跳转到
                    this.paychannel='web'
                }else{  //如果是手机,跳转到
                    this.paychannel='wap'
                }
                this.topayment();
            }).catch(() => {
                this.loadshow=false;
            this.$message({
                type: 'info',
                message: '已取消充值'
            });          
            });
        }
      },
      topayment(){
      this.loadshow=true;
      this.loadtext=`<i class="el-icon-loading"></i>加载中`;
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/recharge',
        data:{
          "user_id":userid,
          "token":token,
          "paymethod":2,
          "paychannel":this.paychannel,
          "amount":this.topupaCount,
          "returnurl":'https://'+window.location.host + '/#/personal/mywallet/topup?status='+this.topupaCount
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result=='success'){
            //不开新页面
            window.location.href=res.data.data.url;
        }else{
            this.$alert(res.data.data.errmsg, '提示', {
                confirmButtonText: '确定'
            });
        }
        

        //开新页面
        //   window.open(res.data.data.url);
        //   setTimeout(() => {
        //     this.$confirm('', '提示', {
        //     confirmButtonText: '已完成付款',
        //     cancelButtonText: '未完成付款',
        //     showClose:false,
        //     closeOnClickModal:false,
        //     center: true
        //   }).then(() => {
        //     window.location.href='https://'+window.location.host + '/#/personal/mywallet/topup?status='+this.topupaCount;
        //   }).catch(() => {
        //   });
        // },1000)
      })
      .catch((res) => {
        this.$alert(res, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.topUp{
    color: #333;
    font-size: 16px;
    .inputcount{
        display: flex;
        margin-top: 20px;
        .el-input{
            width: 200px;
            height: 42px;
        }
        .topup-title{
            width: 95px;
            line-height: 42px;
        }
    }
    .topupButton{
        margin-top: 60px;
        padding-bottom: 65px;
        padding-left: 435px;
        .el-button{
            width: 224px;
            height: 50px;
            color: #2f2e2e;
            font-size: 18px;
        }
    }
    .topupsuccess{
        text-align: center;
        padding-bottom: 40px;
        margin-top: 40px;
    }
}
</style>
