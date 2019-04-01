<template>
<div class="m-train-order">
  <div class="train-order-main">
    <div class="order-head">
      <div class="order-image">
        <img :src="message.img" alt="">
      </div>
      <h4><span>{{ message.title }}</span></h4>
      <div class="order-detail">
        <div class="order-detail-item">
          <label for=""><span>订单编号</span></label><span>{{ message.order }}</span>
        </div>
        <div class="order-detail-item">
          <label for=""><span>学员</span></label><span>{{ message.name }}</span>
        </div>
        <div class="order-detail-item">
          <label for=""><span>手机号</span></label><span>{{ message.phone }}</span>
        </div>
        <div class="order-detail-item">
          <label for=""><span>下单时间</span></label><span>{{ message.time }}</span>
        </div>
      </div>
    </div>
    <div class="order-foot"><img src="../assets/logo-zyt.png" width="90" style="margin:0 auto" alt=""></div>
  </div>
</div>
</template>

<script>
const defaultImage = require('../assets/defaultclass.jpg')
export default {
  name: 'trainOrder',
  data() {
    return {
      message: {

      }
    }
  },
  mounted() {
    this.getMessage()
  },
  methods: {
    getMessage() {
      this.$ajax.post('/course/qrcode', {
        order_id: this.$route.params.orderid
      }).then((res) => {
        this.$NProgress.done();
        // console.log(res)
        if(res.data.result === 'success') {
          this.message = {
            img: res.data.data.classes_img ? this.$imageHost+res.data.data.classes_img : defaultImage,
            title: res.data.data.classes_title,
            order: res.data.data.order_id,
            name: res.data.data.nickname ? res.data.data.nickname : '昵称',
            phone: res.data.data.phone,
            time: res.data.data.created_at
          }
        }
      })
    }
  }
}
</script>

<style lang='less'>
.app-mobile {
  .__view {
    height: 100%;
  }
}
.m-train-order {
  width: 100%;
  height: 100%;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .train-order-main {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    .order-head {
      padding: 20px;
      background: #fff;
      flex: 1;
      margin-bottom: 20px;
      .order-image {
        padding: 20px 0;
        img {
          width: 100%;
        }
      }
      h4 {
        color: #333;
        font-size: 16px;
      }
      .order-detail {
        margin-top: 20px;
        border-top: 1px solid #eee;
        .order-detail-item {
          margin: 15px 0;
          label {
            width: 100px;
            display: inline-block
          }
        }
      }
    }
    .order-foot {
      height: 90px;
      background: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }
  }
}
</style>
