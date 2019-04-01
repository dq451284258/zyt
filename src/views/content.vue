<template>
  <div class="hello">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'contentService',
  data () {
    return {
      msg: 'Welcome to 内容服务'
    }
  },
  mounted () {
    // console.log(this.$router)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
