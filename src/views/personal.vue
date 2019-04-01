<template>
  <div class="personal">
      <div class="personal-inner">
          <div class="persoanl-top">
              <user-info></user-info>
          </div>
          <div class="personal-main">
            <router-view/>
          </div>
      </div>
  </div>
</template>

<script>
import userInfo from '../components/personal.userinfo'
export default {
  name: 'personal',
  components : {
        userInfo,
    },
  data () {
    return {
      msg: 'Welcome to 个人中心'
    }
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.personal{
    @media screen and ( min-width: 1380px ) {
        .personal-inner {
            width: 1380px;
        }
    }
    @media screen and ( max-width: 1380px ) {
        .personal-inner {
            width: 1200px;
        }
    }
}
.personal-inner{
    // width: 1380px;
    margin: 0 auto;
    margin-top: 60px;
    margin-bottom: 20px;
    .personal-main{
        margin-top: 20px;
        display: flex;
        .personal-tab-content{
            flex: 1;
            background: #fff;
            border-radius: 3px;
        }
    }
}
</style>
