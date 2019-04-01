<template>
<div class="personal-m">
  <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'personalM',
  mounted() {
    this.isLogin()
  },
  methods: {
    isLogin() {
      const token = localStorage.getItem('token');
      const userid = localStorage.getItem('userid');
      if(!token || !userid || userid == 'undefined' || token == 'undefined') {
        this.$router.push('/m/login')
      }
    }
  }
}
</script>

<style>
.personal-m {
  width: 100%;
  height: 100%;
}
</style>

