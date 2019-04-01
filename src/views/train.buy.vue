<template>
<div class="train-buy-main">
  <div class="buy-main-content">
    <div class="buy-main-head">
      <div class="main-head-image">
        <img :src="message.img" alt="" width="318" height="242">
      </div>
      <div class="main-head-message">
        <h3><span>{{ message.title }}</span></h3>
        <div class="price"><span>￥{{ message.price }}</span></div>
      </div>
    </div>
    <div class="buy-main-body">
      <div class="main-body-li">
        <div class="main-body-li-lable"><h4>待支付：</h4></div>
        <div class="price"><span>￥{{ message.price }}</span></div>
      </div>
      <div class="main-body-li">
        <div class="main-body-li-lable"><h4>支付方式：</h4></div>
        <div class="type">
          <el-radio v-model="radio" label="1" :disabled='disabled' >余额( ￥{{ balance }} )</el-radio>
          <el-radio v-model="radio" label="2" :disabled='disabledAlipay'><img src="../assets/zhifubao.png" alt=""></el-radio>
        </div>
      </div>
      <div class="main-body-button">
        <el-button type="primary" class="isbuy" v-if="message.isbuy">已购买</el-button>
        <el-button type="primary" @click="pay" v-else>付款</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
const defaultImage = require('../assets/defaultclass.jpg');
export default {
  name: 'trainBuy',
  data() {
    return {
      radio: '',
      message: {
        img: defaultImage,
        title: '',
        price: '',
        id: '',
        isbuy: false
      },
      balance: 0,
      disabled: false,
      disabledAlipay: false
    }
  },
  mounted() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      axios.all([this.$ajax.get('/course/detail/'+this.$route.params.id,{
        params: {
          user_id: localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || ''
        }
      }),this.$ajax.post('/pay/myaccount',{
        user_id: localStorage.getItem('userid') || '',
        token: localStorage.getItem('token') || ''
      })]).then(axios.spread((detail,myaccount) => {
        this.$NProgress.done();
        this.getDetail(detail);
        this.getAccount(myaccount);
      }))
    },
    getDetail(res) {
      if(res.data.result === 'success') {
        this.$NProgress.done();
        const data = res.data.data;
        this.message = {
          img: data.detail.classes_img ? this.$getImageUrl(data.detail.classes_img,318,242) : defaultImage,
          title: data.detail.classes_title,
          price: data.detail.classes_price,
          id: this.$route.params.id,
          isbuy: data.is_buy === 0 ? false : true
        };
      }else {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.go(-1);
          }
        });
      }
    },
    getAccount(res) {
      if(res.data.result === 'success') {
        localStorage.setItem('token',res.data.token);
        this.balance = res.data.data.balance;
        this.disabled = this.balance >= this.message.price ? false : true;
        this.radio = this.disabled ? '2' : '1';
        this.disabledAlipay = this.message.price == 0 ? true : false;
      }else if(res.data.data.errno === '-10002') {
        this.$confirm('登录已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/login');
        }).catch(() => {
          this.$router.go(-1);
        });
      }
    },
    pay() {
      const h = this.$createElement;
      this.$msgbox({
        title: '提示',
        message: h('div', { class: 'messagebox' }, [
          h('div', { class: 'messageimg' }, ''),
          h('p', null, [
            h('span', null, '确定付款'),
            h('span', { class: 'money' }, this.message.price+'元'),
            h('span', null, '购买该课程吗？'),
          ])
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.showCancelButton = false;
            instance.confirmButtonText = '付款中...';
            this.$ajax.post('/pay/pay',{
              user_id: localStorage.getItem('userid'),
              token: localStorage.getItem('token'),
              paymethod: this.radio,
              paychannel: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) ? 'wap' : 'web',
              good_id: this.$route.params.id,
              good_type: 1,
              amount: this.message.price,
              returnurl: 'https://'+window.location.host + '/#/train/' + this.$route.params.id
            }).then((res) => {
              // console.log(res);
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
              if(res.data.result === 'success') {
                localStorage.setItem('token',res.data.token);
                if(this.radio === '2') {
                  window.open(res.data.data.url);
                  setTimeout(() => {
                    this.$confirm('', '提示', {
                      confirmButtonText: '已完成付款',
                      cancelButtonText: '未完成付款',
                      center: true
                    }).then(() => {
                      this.$router.push('/train/'+this.$route.params.id)
                    }).catch(() => {

                    });
                  },1000)
                }else {
                  this.$message({
                    type: 'success',
                    message: '付款成功!'
                  });
                  setTimeout(() => {
                    this.$router.push('/train/'+this.$route.params.id)
                  },1000)
                }

              }else {
                this.$message.error(res.data.data.errmsg)
              }
            }).catch((error) => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
              if(error.response) {
                this.$message.error(error.response.data.message)
              }
            })
          } else {
            done();
          }
        }
      }).then((res) => {

      }).catch(() => {

      });
    }
  }
}
</script>

<style lang='less'>
.messagebox {
  .messageimg {
    width: 60px;
    height: 60px;
    background: url('../assets/kc.png') no-repeat center center;
    background-size: 100%;
    margin: 10px auto;
    border-radius: 50%;
  }
  .money {
    color: #ff9000;
  }
}
.train-buy-main {
  display: flex;
  justify-content: center;
  .buy-main-content {
    @media screen and ( min-width: 1380px ) {
      width: 1380px;
    }
    @media screen and ( max-width: 1380px ) {
      width: 1200px;
    }
    .buy-main-head {
      background: #fff;
      display: flex;
      margin: 30px 0;
      .main-head-image {
        display: flex;
      }
      .main-head-message {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 40px 30px;
        max-width: 600px;
        h3 {
          color: #333;
          font-size: 18px;
          font-weight: bold;
        }
        .price {
          color: #ff9000;
          font-size: 24px;
        }
      }
    }
    .buy-main-body {
      background: #fff;
      display: flex;
      padding: 30px;
      flex-direction: column;
      .main-body-li {
        display: flex;
        line-height: 40px;
        margin: 20px 0;
        .main-body-li-lable {
          color: #333;
          font-size: 16px;
          display: flex;
          width: 100px;
          margin-right: 20px;
          h4 {
            border-bottom: 2px solid #fadd1d;
            height: 42px;
          }
        }
        .price {
          color: #ff9000;
          font-size: 24px;
        }
      }
      .main-body-button {
        text-align: center;
        margin: 20px 0;
        .isbuy {
          background: #ccc;
          border-color: #ccc;
        }
        button {
          height: 40px;
          width: 220px;
        }
      }
    }
  }
}
</style>

