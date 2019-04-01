<template>
  <div class="zyt-foot">
    <div class="zyt-foot-content">
      <div class="zyt-foot-content-main">
        <div class="inner">
          <div class="zyt-foot-content-main-tab">
            <div class="zyt-foot-content-main-tab-logo">
              <img src="../assets/logo-footer.png" alt="">
            </div>
            <div class="zyt-foot-content-main-tab-item">
              <ul>
                <li>
                  <router-link to='/train'>培训</router-link>
                </li>
                <li>
                  <router-link to='/expert'>专家咨询</router-link>
                </li>
                <!-- <li>
                  <router-link to='/content'>内容服务</router-link>
                </li> -->
                <li>
                  <router-link to='/activity'>活动中心</router-link>
                </li>
              </ul>
            </div>
          </div>
          <div class="zyt-foot-content-main-info">
            <span class='item-name'>Tel</span><span class='tel'>400-999-8260</span>
            <span class='item-name'>E-mail</span><span class='email'>jun_hu@arcplus.com.cn</span>
            <span class='item-name'>Add</span><span class='address'>上海市恒丰路329号隆宇国际商务广场12楼</span>
          </div>
          <div class="zyt-foot-content-main-code">
            <!-- <img src="../assets/codeweixin.png" alt=""> -->
            <!-- <div class='zyt-foot-content-main-code-text'>关注微信</div> -->
          </div>
        </div>
      </div>
      <div class="zyt-foot-content-record">
        <div class="inner">
          <div class='record-text'>Copyright@筑英台 http://zyt.arctron.cn/ 沪ICP备17034208号</div>
					<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31010602002396"><span></span><p>沪公网安备 31010602002396号</p></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'footbar',
  data() {
    return {
      msg: 'foot'
    }
  }
}
</script>

<style lang="less">
.el-footer{
  padding: 0!important;
}
.zyt-foot-content-main{
  background: #222;
  border-bottom: 1px solid #333;
  @media screen and ( min-width: 1380px ) {
    .inner {
      max-width: 1380px;
    }
  }
   @media screen and ( max-width: 1380px ) {
    .inner {
      max-width: 1200px;
    }
  }
  .inner{
    // max-width: 1380px;
    min-width: 980px;
    margin: 0 auto;
    background: #222;
    position: relative;
  }
  .zyt-foot-content-main-tab{
    height: 86px;
    line-height: 86px;
    color: #999;
    font-size: 14px;
    display: flex;
    .zyt-foot-content-main-tab-logo{
      // width: 230px;
      margin-right: 80px;
      text-align: center;
      margin-top: 15px;
    }
    .zyt-foot-content-main-tab-item{
      min-width: 396px;
      ul{
        list-style: none;
        display: flex;
        li{
          padding: 0 50px 0 0;
          a{
            color: #999;
            font-size: 14px;
          }
        }
      }
    }
  }
  .zyt-foot-content-main-info{
    min-width: 730px;
    height: 36px;
    color: #6a6a6a;
    font-size: 12px;
    .item-name{
      margin-right: 15px;
    }
    .tel{
      margin-right: 50px;
    }
    .email{
      margin-right: 80px;
    }
  }
  .zyt-foot-content-main-code{
    position: absolute;
    top: 20px;
    right: 95px;
    img{
      width: 65px;
      height: 65px;
    }
    .zyt-foot-content-main-code-text{
      font-size: 12px;
      color: #f4f4f4;
      text-align: center;
      line-height: 30px;
    }
  }
}
.zyt-foot-content-record{
  background: #191919;
  width: 100%;
  @media screen and ( min-width: 1380px ) {
    .inner {
      max-width: 1380px;
    }
  }
   @media screen and ( max-width: 1380px ) {
    .inner {
      max-width: 1200px;
    }
  }
  .inner{
    // max-width: 1380px;
    min-width: 980px;
    margin: 0 auto;
    background: #191919;
    .record-text{
      display: inline-block;
      height: 109px;
      font-size: 12px;
      color: #666;
      padding: 28px 0 0 0px;
    }
    a{
      display:inline-block;
      text-decoration:none;
      margin-left:20px;
      span{
        background: url('../assets/record.png');
        background-size: 14px 14px;
        display:inline-block;
        width:14px;
        height:14px;
      }
      p{
        display:inline-block;
        margin: 0px 0px 0px 5px;
        color:#666;
        font-size:12px;
      }
    }
  }
}
</style>

