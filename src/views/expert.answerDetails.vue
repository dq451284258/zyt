<template>
  <div id="expertAnswerDetails">
    <div class="answerDetails-inner">
      <div class="payment" v-if='payment'>
        <div class="payment-info">
          <div class="payment-info-avator">
            <img :src="question.answer_user_avatar" alt="" v-if='question.answer_user_avatar?true:false'>
            <img src="../assets/morenmoren.jpg" v-if='question.answer_user_avatar?false:true' alt="">
          </div>
          <div class="payment-info-desc">
            <div class="payment-info-desc-question" v-text='question.ask_title'></div>
            <div class="payment-info-desc-name">
              <span class="expert-name" @click='todetails(question.answer_user_id)'>
                <span class='expertnamestyle'>{{question.answer_user_name}}</span>的回答
              </span>
              <span class="skill" v-text='question.skill_name'></span>
            </div>
          </div>
          <div class="payment-info-payment">已购买</div>
        </div>
        <div class="payment-question-desc">
          问题描述：{{question.ask_description}}
          <div class="payment-question-answer-img">
            <span v-for='(item,index) in question.ask_images' :key='index'><img :src="$imageHost+item.file_path" alt=""></span>
          </div>
        </div>
        <div class="payment-question-answer">
          <div class="payment-question-answer-text" v-html='question.answer_content'></div>
          <div class="payment-question-answer-img">
            <span v-for='(item,index) in question.answer_images' :key='index'><img :src="$imageHost+item.file_path" alt=""></span>
          </div>
          <!-- <span class="browse-numb namegray rightfloat">{{question.buy_num}}人看过</span> -->
        </div>
        <div class="footer-like">
          <span class="nopayment-question-info-look">{{question.buy_num}}人</span>
          <span class="nopayment-question-info-like">{{question.like_num}}人</span>
          <div :class="{'add-like':addlike,'cancle-like':!addlike}" @click='tolike'>
            <span>{{question.like_num}}</span>
          </div>
        </div>
      </div>
      <div class="nopayment" v-if='nopayment'>
        <div class="nopayment-question">
          <div class="nopayment-question-info">
            <div class="nopayment-question-info-img">
              <div class='nopayment-question-info-avator'>
                <img :src="question.answer_user_avatar" alt="" v-if='question.answer_user_avatar?true:false'>
                <img src="../assets/morenmoren.jpg" v-if='question.answer_user_avatar?false:true' alt="">
              </div>
              <span class="nopayment-question-info-name" @click='todetails(question.answer_user_id)'>
                <span class='expertnamestyle'>{{question.answer_user_name}}</span>的回答
              </span>
            </div>
            <div class="nopayment-question-info-questionname" v-text='question.ask_title'></div>
            <div class="nopayment-question-info-other">
              <span class="nopayment-question-info-skill" v-text='question.skill_name'></span>
              <span class="nopayment-question-info-look" v-text='question.buy_num'></span>
              <span class="nopayment-question-info-like" v-text='question.like_num'></span>
            </div>
          </div>
          <div class="nopayment-question-tobuy">
            <!-- <el-button type="primary" @click='tolook'>￥{{question.look_answer_price}}付费查看</el-button> -->
          </div>
        </div>
        <div class="nopayment-desc">
          <span class="nopayment-desc-title">问题描述：</span>
          <span class="nopayment-desc-text" v-text='question.ask_description'></span>
          <div class="nopayment-desc-img">
            <span v-for='(item,index) in question.ask_images' :key='index'><img :src="$imageHost+item.file_path" alt=""></span>
          </div>
        </div>
        <div class="expert-quizPay">
          <div class="pay-price">
            <span class="quiz-price-title">待支付</span>
            <span class='price-number'>￥{{question.look_answer_price}}</span>
          </div>
          <div class="pay-method">
            <span class="quiz-price-title">支付方式</span>
            <el-radio v-model="radio" label="1" :disabled='ifchoose' >余额
              <span class="balance" v-if='showbalance'>账户余额{{balance}}元</span>
            </el-radio>
            <el-radio v-model="radio" label="2" :disabled='ifzero'>
              <img src="../assets/zhifubao.png" alt="">
            </el-radio>
          </div>
          <div class="pay-button">
            <!-- <router-link to='/expert/payment'><el-button type="primary">去付款</el-button></router-link> -->
            <el-button type="primary" :loading="loadshow"  @click='tolook' v-html='loadtext'></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'expertAnswerDetails',
  data () {
    return {
      question:{},
      payment:false,
      nopayment:false,
      paychannel:'',
      radio:'',
      balance:'',
      ifchoose:false,
      loadtext:'付款查看回答',
      loadshow:false,
      ifzero:false,//零元不可支付包支付
      type:'add',
      addlike:false,
      showbalance:false
    }
  },
  watch: {
    '$route' (to, from) {
      this.getMessage();
      this.judgeligon();
    },
  },
  mounted () {
    this.getMessage();
    this.judgeligon();
  },
  methods:{
    getMessage() {
      axios.all([this.$ajax.get('/qa/detail/'+this.$route.query.id,{
        params: {
          user_id:localStorage.getItem("userid"),
          token:localStorage.getItem("token")
        }
      })])
      .then(axios.spread((answerlist) => {
        this.getdata(answerlist);
        this.$NProgress.done();
      })).catch((error) => {
        console.log(error)
      })
    },
    getdata(res){
      let datainfo=res.data.data;
      this.question=datainfo;
      this.questionid=this.$route.query.id;
      if(this.question.answer_user_avatar){
        this.question.answer_user_avatar=this.$getImageUrl(this.question.answer_user_avatar,47,47)
      }
      if(this.question.is_like==1){
        this.addlike=true;
        this.type='cancel';
      }else{
        this.addlike=false;
        this.type='add'
      }
      if(this.question.is_buy==0){
        this.nopayment=true;
        this.payment=false;
      }else{
        this.payment=true;
        this.nopayment=false;
      }
      if(this.question.look_answer_price==0){
        this.ifzero=true;
      }

      if(localStorage.getItem('token')&& localStorage.getItem('userid')) {
        this.account();
      }
    },
    tolook(){
      if(this.radio==''){
        this.$alert('请选择支付方式', '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }
      if(this.haslogin()){
        this.$confirm('确认付费查看该问题吗?', '提示', {
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
          this.$message({
            type: 'info',
            message: '已取消咨询'
          });
        });
      }
    },
    topayment(){
      this.loadtext=`<i class="el-icon-loading"></i>加载中`;
      this.loadshow=true;
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/pay',
        data:{
          "user_id":userid,
          "token":token,
          "paymethod":this.radio,
          "paychannel":this.paychannel,
          "good_id":this.questionid,
          "good_type":3,
          "amount":this.question.look_answer_price,
          "returnurl":'https://'+window.location.host + '/#/expert/answer?id=' + this.questionid
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result=='success'){
          if(this.radio==1){
            this.$message({
              type: 'success',
              message: '付款成功!'
            });
            setTimeout(() => {
              window.location.reload();
            },1000)
          }else{
            window.open(res.data.data.url);
            setTimeout(() => {
              this.$confirm('', '提示', {
                confirmButtonText: '已完成付款',
                cancelButtonText: '未完成付款',
                showClose:false,
                closeOnClickModal:false,
                center: true
              }).then(() => {
                window.location.reload();
              }).catch(() => {
                // this.loadtext='去付款';
                // this.loadshow=false;
                window.location.reload();
              });
            },1000)
          }
        }else{
          this.$alert(res.data.data.errmsg, '提示', {
            confirmButtonText: '确定'
          });
        }

      })
      .catch((res) => {
        this.$alert(res, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
    judgeligon(){
      if(localStorage.getItem('token')&& localStorage.getItem('userid')) {
        this.showbalance=true;
      }else {
        this.showbalance=false;
      }
    },
    haslogin() {
        if(localStorage.getItem('token')&& localStorage.getItem('userid')) {
            return true
        }else {
            this.$confirm('您还没有登录, 是否登录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$router.push('/login')
            }).catch(() => {

            });
                return false
        }
    },
    account(){
      let userid= localStorage.getItem("userid")||"";
      let token= localStorage.getItem("token")||"";
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
        console.log(res.data.data.errno);
        if(res.data.data.errno=='-10002'){
          this.$confirm('您还没有登录, 是否登录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$router.push('/login')
          }).catch(() => {

          });
        }else{
          localStorage.setItem('token',res.data.token);
          this.$NProgress.done();
          this.balance=res.data.data.balance;
          if(this.balance-this.question.look_answer_price<0){
            this.ifchoose=true
          }
        }

      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
    todetails(expertid){
      this.$router.push({ name: 'expertInformation',query:{id:expertid}})
    },
    //点赞
    tolike(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/user/likes',
        data:{
          "user_id":userid,
          "token":token,
          "relation_id":this.questionid,
          "type":1,
          "act":this.type
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result=='fail'){
          this.$alert(res.data.data.errmsg, '提示', {
            confirmButtonText: '确定'
          });
        }else{
          if(this.type=='add'){
            this.question.like_num++;
            this.type='cancel';
            this.addlike=true;
          }else{
            this.question.like_num--;
            this.type='add';
            this.addlike=false;
          }
        }

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
<style scoped lang="less">
.answerDetails-inner{
  max-width: 900px;
  margin: 20px auto;
  .nopayment{
    .expert-quizPay{
      margin-top: 20px;
      padding: 30px 28px 78px 28px;
      background: #fff;
      border-radius: 3px;
      .quiz-price-title{
        display: inline-block;
        font-size: 16px;
        color: #2f2e2e;
        height: 28px;
        border-bottom: 2px solid #fed900;
        margin-right: 50px;
      }
      .balance{
        color: #999;
        margin-left: 10px;
      }
      .pay-price{
        color: #ff9000;
        font-size: 20px;
      }
      .pay-method{
        margin-top: 50px;
      }
      .pay-button{
        display: flex;
        justify-content:center;
        a{
          display: inline-block;
          width: 225px;
          height: 48px;
          border-radius: 3px;
          text-align: center;
          line-height: 48px;

          color: #2f2e2e;
          button{
            width: 225px;
            height: 48px;
            color: #2f2e2e;
            padding: 0;
            font-size: 18px;
          }
        }
        margin-top: 50px;
      }
    }
    .nopayment-question{
      display: flex;
      background: #fff;
      padding: 30px;
      border-radius: 3px;
      margin-bottom: 20px;
      .nopayment-question-info{
        flex:1;
        .nopayment-question-info-img{
          vertical-align:middle;
          font-size: 14px;
          color: #666;
          display: flex;
          .nopayment-question-info-avator{
            margin-right: 15px;
            width: 47px;
            height: 47px;
            // background: url(../assets/morenmoren.jpg);
            // background-size: 100% 100%;
          }
          img{
            width: 47px;
            height: 47px;
            border-radius: 47px;
          }
          .nopayment-question-info-name{
            margin-top: 15px;
            cursor: pointer;
            .expertnamestyle{
              color: #ff9000;
            }
          }
        }
        .nopayment-question-info-questionname{
          font-size: 16px;
          color: #333;
          font-weight: 700;
          line-height: 40px;
        }
        .nopayment-question-info-other{
          font-size: 14px;
          color: #ccc;
          .nopayment-question-info-skill{
            line-height: 14px;
            padding-right: 30px;
            border-right: 1px solid #ccc;
          }
          .nopayment-question-info-look{
            margin-left: 54px;
            position: relative;
          }
          .nopayment-question-info-look:before{
            content:'';
            width: 17px;
            height: 11px;
            background: url('../assets/View.png');
            position: absolute;
            left: -20px;
            top: 4px;
          }
          .nopayment-question-info-like{
            margin-left: 35px;
            position: relative;
          }
          .nopayment-question-info-like:before{
            content:'';
            width: 12px;
            height: 12px;
            background: url('../assets/Like.png');
            position: absolute;
            left: -15px;
            top: 4px;
          }
        }
      }
      .nopayment-question-tobuy{
        width: 125px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        border-radius: 3px;
        font-size: 14px;
        color: #333;
        button{
          width: 125px;
          height: 32px;
          padding: 0;
          color: #333;
          font-size: 14px;
        }
      }
    }
    .nopayment-desc{
      background: #fff;
      padding: 30px 35px;
      border-radius: 3px;
      font-size: 12px;
      color: #666;
      .nopayment-desc-text{
        line-height: 21px;
      }
      .nopayment-desc-img{
        margin-top: 15px;
        img{
          margin-right: 15px;
        }
      }
      // margin-right: 15px;
    }
  }
  .payment{
    background: #fff;
    padding: 25px 30px;
    border-radius: 3px;
    .payment-info{
      display: flex;
      .payment-info-avator{
        width: 47px;
        height: 47px;
        border-radius: 47px;
        margin-right: 12px;
        // background: url(../assets/morenmoren.jpg);
        img{
          width: 100%;
          height: 100%;
        }
      }
      .payment-info-desc{
        flex: 1;
        .payment-info-desc-question{
          font-size: 16px;
          color: #333;
          font-weight: 700;
          margin-bottom: 10px;
        }
        .payment-info-desc-name{
          font: 14px;
          color: #666;
          .expert-name{
            cursor: pointer;
            .expertnamestyle{
              color: #ff9000;
            }
          }
          .skill{
            color: #ccc;
            margin-left: 20px;
          }
        }
      }
      .payment-info-payment{
        width: 120px;
        height: 35px;
        border-radius: 3px;
        text-align: center;
        line-height: 35px;
        background: #eeeeee;
        font-size: 14px;
        color: #333;
      }
    }
    .payment-question-desc{
      line-height: 21px;
      margin-top: 15px;
      color: #666;
      font-size: 12px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eeeeee;
      .payment-question-answer-img{
        margin-top: 15px;
        img{
          margin-right: 15px;
        }
      }
    }
    .footer-like{
      margin-top: 20px;
      margin-bottom: 20px;
      .nopayment-question-info-like{
        margin-left: 35px;
        position: relative;
      }
      .nopayment-question-info-like:before{
        content:'';
        width: 12px;
        height: 12px;
        background: url('../assets/Like.png');
        position: absolute;
        left: -15px;
        top: 4px;
      }
      .nopayment-question-info-look{
        margin-left: 21px;
        position: relative;
        margin-right: 20px;
      }
      .nopayment-question-info-look:before{
        content:'';
        width: 17px;
        height: 11px;
        background: url('../assets/View.png');
        position: absolute;
        left: -20px;
        top: 4px;
      }
      .add-like{
        width: 75px;
        height: 38px;
        background: #fed900;
        border-radius: 38px;
        line-height: 38px;
        color: #333;
        position: relative;
        padding-left: 40px;
        float: right;
        cursor: pointer;
      }
      .add-like:before{
        content:'';
        width: 19px;
        height: 17px;
        background: url('../assets/Like2.png');
        position: absolute;
        left: 15px;
        top: 10px;
      }
      .cancle-like{
        width: 75px;
        height: 38px;
        background: #fed900;
        border-radius: 38px;
        line-height: 38px;
        color: #fff;
        position: relative;
        padding-left: 40px;
        float: right;
        cursor: pointer;
      }
      .cancle-like:before{
        content:'';
        width: 19px;
        height: 17px;
        background: url('../assets/aixin.png');
        position: absolute;
        left: 15px;
        top: 10px;
      }
    }
    .payment-question-answer{
      margin-top: 12px;
      border-bottom: 1px solid #eee;

      .nopayment-question-info-like{
        margin-left: 21px;
        position: relative;
      }
      .nopayment-question-info-like:before{
        content:'';
        width: 12px;
        height: 12px;
        background: url('../assets/Like.png');
        position: absolute;
        left: -20px;
        top: 4px;
      }
      .payment-question-answer-text{
        color: #666;
        font-size: 12px;
        line-height: 22px;
      }
      .payment-question-answer-img{
        margin-top: 15px;
        img{
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
