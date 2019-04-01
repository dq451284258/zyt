<template>
  <div class="qrcode-con">
    <div class="qrcode-main" id="card" v-show="!showimg">
        <div class="qrcode-main-head">
            <span>{{ name }}</span>的专属名片二维码
        </div>
        <div class="qrcode-main-body">
            <qriously :value="qrcode.value" :size="qrcode.size" :backgroundAlpha="qrcode.backgroundAlpha"/>
        </div>
        <div class="blank" />
    </div>
    <img :src="showimg" v-show="showimg"  alt="">
    <el-footer class="phone-save">
        <span to="" class="jump-save">长按二维码保存到手机上</span>
    </el-footer>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  export default {
    name: 'personalQrcodeM',
    data(){
      return {
        name: "",
        qrcode: {
          value: this.$host+'/#/m/personal/card/'+this.$route.params.userid,
          size: 200,
          backgroundAlpha: 1
        },
        showimg: ''
      }
    },
    methods: {
      saveCard () {
        html2canvas(document.querySelector("#card"), {scale:2,logging:false,useCORS:true}).then(canvas => {
          var type = 'png';
          var imgData = canvas.toDataURL(type);
          this.showimg = imgData;
        });
      }
    },
    mounted () {
      this.name = this.$route.query.name;
      this.saveCard()
    }
  }
</script>

<style lang='less'>
.qrcode-con {
    position:absolute;
    top:0;
    right:0;
    left:0;
    bottom:0;
    height:100%;
    background:#fff;
    text-align: center;
    img {
      width: 80%;
      margin-top: 50px;
    }
    .qrcode-main {
        margin:30px;
        background:#fff;
        border:2px solid #F5F5F5;
        border-radius:8px;
        box-shadow: 0 1px 10px 0 rgba(0,0,0,0.03);
        .qrcode-main-head{
            width:100%;
            height:45px;
            line-height:45px;
            text-align:center;
            background:rgba(200,200,200,0.3);
            font-size:16px;
            color:#282932;
        }
        .qrcode-main-body {
          text-align: center;
          padding: 100px 0;
          #card {
            width: 200px;
            margin: 0 auto;
          }
            .code-img {
                margin:95px 0;
                img {
                    margin: 0 auto;
                }
            }
          }
          .blank {
            height:1px;
        }
    }
    .phone-save{
        position:fixed;
        bottom:0;
        width:100%;
        background-color:#FDD900;
        display: flex;
        justify-content:center;
        align-items:Center;
        .jump-save{
            width:100%;
            display:inline-block;
            text-align:center;
            color:#282932;
            font-size:18px;
        }
    }
}
</style>

