<template>
<div class="cropper-module" id="imagecropper">
  <transition name="el-zoom-in-top">
    <div class="cropper-main" v-show="show">
      <div class="cropper-inner">
        <div class="cropper-message"><span class="el-icon-close" @click="close()"></span></div>
        <vueCropper
          ref="cropper"
          :img="example2.img"
          :autoCrop="example2.autoCrop"
          :autoCropWidth="example2.autoCropWidth"
          :autoCropHeight="example2.autoCropHeight"
          :fixedBox="example2.fixedBox"
          :fixed="example2.fixed"
          :minAutoCropWidth="example2.autoCropWidth"
          :minAutoCropHeight="example2.autoCropHeight"
          :info="example2.info"
          :fixedNumber="example2.fixedNumber"
        ></vueCropper>
        <div class="cropper-btn"><el-button type="primary" @click="finish()">确定</el-button></div>
      </div>
    </div>
  </transition>
  <div class="cropper-mask"></div>
</div>
</template>

<script>
import vueCropper from '@/components/vueCropper';
export default {
  name: 'cropper',
  props: ['file','w','h'],
  data() {
    return {
      show: false,
      example2: {
				img: this.getObjectURL(this.file),
				autoCrop: true,
				autoCropWidth: this.w,
        autoCropHeight: this.h,
        outputType: 'jpeg',
        fixedBox: false,
        fixed: true,
        info: false,
        fixedNumber: [this.w,this.h]
			}
    }
  },
  mounted() {
    this.show = true;
  },
  components: {
    vueCropper
  },
  methods: {
    getObjectURL (file) {
      let url = null ;
      if (window.createObjectURL!=undefined) {
        url = window.createObjectURL(file) ;
      } else if (window.URL!=undefined) {
        url = window.URL.createObjectURL(file) ;
      } else if (window.webkitURL!=undefined) {
        url = window.webkitURL.createObjectURL(file) ;
      }
      return url;
    },
    close() {
      this.$emit('closeCropper')
    },
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        // console.log(window.URL.createObjectURL(data))
        this.$emit('getNewFile',data)
      })
		}
  }
}
</script>

<style lang='less'>
.cropper-module {
  .cropper-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 2000;
  }
  .cropper-main {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2010;
    .cropper-inner {
      display: inline-block;
      width: 600px;
      height: 600px;
      vertical-align: middle;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      font-size: 18px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      text-align: left;
      overflow: hidden;
      backface-visibility: hidden;
      padding-top: 36px;
      position: relative;
      .cropper-message {
        position: absolute;
        top: 0;
        left: 0;
        line-height: 36px;
        text-align: right;
        right: 10px;
        span {
          cursor: pointer;
        }
      }
      .cropper-btn {
        position: absolute;
        z-index: 1;
        bottom: 10px;
        left: 50%;
        margin-left: -35px;
        button {
          color: #333;
        }
      }
    }
  }
  .cropper-main::after {
    content: "";
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
}
</style>
