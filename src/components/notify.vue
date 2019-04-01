<template>
<div class="notify-module" id='notify'>
    <div v-show="styleOptions.show">
      <div class="notify-main">
        <div class="notify-inner" :style="{opacity: styleOptions.notifyOpacity, top: styleOptions.notifyTop, bottom: styleOptions.notifyBottom}">
          <div class="notify-inner-head">
            <h4><span>系统通知</span><span class="el-icon-close" @click="close()"></span></h4>
          </div>
          <div class="notify-inner-text">
            <vue-scroll :ops="ops" @handle-scroll='handleScroll'>
            <div ref="viewBox">
              <div class="item" v-for="(n,index) in list" :key="index">
                <div class="type">
                  <img src="../assets/system.png" v-if="n.type === 1" alt="">
                  <img src="../assets/talk.png" v-else alt="">
                </div>
                <div class="text">
                  <h4>
                    <span>{{ n.title.before }}</span>
                    <span v-for="(m,index) in n.title.list" :key="index">
                      <span class="haslink" v-show="m.link" v-bind:data-to="m.link" @click="linkTo(m.link)">{{ m.linkText }}</span>
                      <span>{{ m.content }}</span>
                    </span>
                  </h4>
                  <p>
                    <span>{{ n.content.before }}</span>
                    <span v-for="(m,index) in n.content.list" :key="index">
                      <span class="haslink" v-show="m.link" v-bind:data-to="m.link" @click="linkTo(m.link)">{{ m.linkText }}</span>
                      <span>{{ m.content }}</span>
                    </span>
                  </p>
                  <p>
                    <span>{{ n.time }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="more" v-show="more">
              <span class="el-icon-loading"></span>
            </div>
            <div class="nomore" v-show="nomore">
              <span>没有更多消息了...</span>
            </div>
            </vue-scroll>
          </div>
        </div>
      </div>
    </div>
  <div class="notify-mask" :style="{opacity: styleOptions.maskOpacity}"></div>
</div>
</template>

<script>
let timer;
export default {
  name: 'notify',
  data() {
    return {
      list: [],
      load: false,
      ops: {
        bar: {
          background: '#c1c1c1'
        }
      },
      l: 5,
      p: 1,
      more: false,
      nomore: false,
      styleOptions: {
        maskOpacity: 0,
        notifyOpacity: 0,
        notifyTop: '8%',
        notifyBottom: '12%',
        show: false
      },
      num: 0
    }
  },
  props: ['noread'],
  mounted() {
    this.getMyMessage()
    this.load = true;
    this.num = this.noread;
  },
  methods: {
    linkTo(url) {
      this.close();
      this.$emit('link',url)
    },
    close() {
      this.load = false;
      setTimeout(() => {
        this.$emit('closeNotify')
      })
    },
    handleScroll(vertical, horizontal, nativeEvent) {
      const viewH = this.$refs.viewBox.clientHeight;
      if(vertical.scrollTop >= viewH - 657 - 10) {
        clearTimeout(timer);
        this.getMore()
      }
    },
    getMyMessage() {
      this.$ajax('/user/mymessage',{
        params: {
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token'),
          l: this.l,
          p: this.p
        }
      }).then((res) => {
        // console.log(res);
        if(res.data.result === 'success') {
          let arr = [],list = res.data.data.list.data;
          if(list.length) {
            this.nomore = false;
            this.more = false;
          }else {
            this.nomore = true;
            this.more = false;
          }
          for(let i = 0; i < list.length; i ++ ) {
            arr.push({
              img: '',
              title: this.stringToDoom(list[i].user_message_title),
              content: this.stringToDoom(list[i].user_message_content),
              time: list[i].send_time,
              status: list[i].message_status,
              id: list[i].id,
              type: list[i].message_type || 1
            })
            if(list[i].message_status === 0) {
              this.num = this.num - 1;
            }
          }
          this.list = this.list.concat(arr);
          this.$emit('read',this.num)
        }
      })
    },
    getMore() {
      if(!this.nomore) {
        this.more = true;
        timer = setTimeout(() => {
          this.p += 1;
          this.getMyMessage()
        },300)
      }
    },
    stringToDoom(stringName) {
      let obj = {
        before: '',
        list: []
      }
      if(!stringName || stringName === '') {
        return obj;
      }else {
        if(stringName.search('<') != -1 && stringName.search('>') != -1) {
          let stringBefore = stringName.split('<')[0], stringAfter = stringName.split('>')[stringName.split('>').length-1];
          let arr = [],str = stringName.split('<'),li = {};
          for(let i = 1; i < str.length; i ++) {
            let link = '',linkText = '';
            if(str[i].indexOf('[') != -1 && str[i].indexOf(']') != -1) {
              if(str[i].split('[')) {
                if(str[i].split('[')[1].split(']')) {
                  linkText = str[i].split('[')[1].split(']')[1].split('>')[0];
                  if(str[i].split('[')[1].split(']')[0].split('/#')) {
                    link = str[i].split('[')[1].split(']')[0].split('/#')[1];
                  }
                }
              }
            }
            arr.push({
              link: link,
              linkText: linkText,
              content: str[i].split('>')[1]
            })
          }
          obj = {
            before: stringBefore,
            list: arr
          }
          return obj
        }else {
          obj = {
            before: stringName,
            list: []
          }
          return obj;
        }
      }
    }
  },
  watch: {
    load() {
      if(this.load) {
        this.styleOptions.show = true;
        setTimeout(() => {
          this.styleOptions.maskOpacity = 0.5;
          this.styleOptions.notifyOpacity = 1;
          this.styleOptions.notifyTop = '10%';
          this.styleOptions.notifyBottom = '10%';
        },150)
      }else {
        this.styleOptions.maskOpacity = 0;
        this.styleOptions.notifyOpacity = 0;
        this.styleOptions.notifyTop = '8%';
        this.styleOptions.notifyBottom = '12%';
        setTimeout(() => {
          this.styleOptions.show = false;
        },150)
      }
    }
  }
}
</script>

<style lang='less'>
.notify-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 2000;
  transition: all 0.15s;
}
.notify-main {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 2010;
  .notify-inner {
    width: 920px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
    position: fixed;
    left: 50%;
    margin-left: -460px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all 0.3s;
    .more {
      line-height: 60px;
      text-align: center;
      font-size: 30px;
      color: #ccc;
    }
    .nomore {
      line-height: 60px;
      text-align: center;
      font-size: 14px;
      color: #ccc;
    }
    .notify-inner-head {
      width: 100%;
      line-height: 60px;
      position: relative;
      z-index: 1;
      background: #f6f6f6;
      padding: 0 30px;
      color: #666;
      h4 {
        display: flex;
        justify-content: space-between;
        span {
          line-height: 60px;
          font-size: 16px;
        }
        span.el-icon-close {
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
    .notify-inner-text {
      padding: 90px 30px 30px 30px;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      .item {
        padding: 30px 30px 30px 0;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-wrap: nowrap;
        .type {
          width: 50px;
        }
        .text {
          padding-left: 30px;
          font-size: 14px;
          color: #666;
          h4 {
            color: #333;
            font-size: 16px;
          }
          .haslink {
            color: #ffa142;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
