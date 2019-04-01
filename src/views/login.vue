<template>
<div class="login-main">
  <router-view :pathParams="pathParams"></router-view>
</div>
</template>

<script>
export default {
  name:'login',
  data() {
    return {
      pathParams: ''
    }
  },
  mounted() {
    // console.log(this.$route)
    this.pathParams = this.$pathFrom.fullPath;
  }
}
</script>

<style lang='less'>
.login-main {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
