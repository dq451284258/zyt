<template>
  <div class="image-box" :style="style" @click.stop="option.isLink && go()" >
    <div class="image-content">
      <img :src="option.src" v-if="type !== 'cover'" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'imageBox',
    props:['link', 'w', 'h', 'src', 't'],
    data() {
      return {
        type: 'cover', //cover填充; wcover宽度撑满(默认上下剧中); hcover高度撑满(默认左右居中); wcovertop宽度撑满靠上;
        option: {
          width: '',
          height: '',
          src: ''
        },
        style: {},
        imgStyle: {}
      }
    },
    created() {
      this.type = this.t ? this.t : 'cover';
      this.option = {
        width: this.w,
        height: this.h,
        src: this.getImageUrl(),
        isLink: this.link ? true : false
      }
      if(this.type === 'cover') {
        this.style = {
          'width': this.w+'px',
          'height': this.h+'px',
          'background-image': 'url('+this.getImageUrl()+')',
          'cursor': this.link ? 'pointer' : 'auto'
        }
      }else if(this.type === 'wcover') {
        this.style = {
          'width': this.w+'px',
          'height': this.h+'px',
          'cursor': this.link ? 'pointer' : 'auto',
          'display': 'flex',
          'flex-direction': 'column',
          'justify-content': 'center'
        }
      }else if(this.type === 'hcover') {
        this.style = {
          'width': this.w+'px',
          'height': this.h+'px',
          'cursor': this.link ? 'pointer' : 'auto',
          'display': 'flex',
          'justify-content': 'center'
        }
      }else{
        this.style = {
          'width': this.w+'px',
          'height': this.h+'px',
          'cursor': this.link ? 'pointer' : 'auto'
        }
      }
    },
    methods: {
      getImageUrl() {
        let url = this.src;
        let w = 1200, h = 1200;
        if(this.type === 'cover' || this.type === 'wcover' || this.type === 'wcovertop') {
          w = this.w > this.h ? this.w : this.h;
          h = this.h > this.w ? this.h : this.w;
        }else {
          w = this.w;
          h = this.h;
        }
        if(url) {
          if(url.split('/w/').length > 1) {
            let wurl = url.split('/w/')[0];
            let trueurl = 'http://zyt-file.arctron.cn' + wurl + '/w/' + w + '/h/' + h + '/q/100'
            return trueurl
          }else {
            return url
          }
        }else {
          return ''
        }
      },
      go() {
        this.$router.push(this.link)
      }
    }
  }
</script>

<style lang='less'>
.image-box {
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
