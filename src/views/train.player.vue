<template>
  <div class="train-player" :style="{'height': fullHeight}">
    <div class="train-player-content" v-show="isshow">
      <div class="player">
        <div class="player-title">{{ classDetail.name }} <a class="download-btn" :href="classDetail.link" :download="classDetail.name" v-show="classDetail.isbuy && classDetail.link" >课件下载</a> </div>
        <div id="J_prismPlayer" class="prism-player"></div>
      </div>
      <div class="player-list" id="drag" :style="{'min-width': dragMinWidth+'px','width': dragWidth+'px'}">
        <div class="course-drag" v-show="showList" v-drag><div class="drag"></div></div>
        <div class="play-list-main" v-show="showList">
          <vue-scroll>
          <div class="play-list-content">
            <div class="play-list-close" @click="showList = false,dragMinWidth = 50,dragWidth = 50"><span class="el-icon-close"></span></div>
            <div class="list">
              <div class="item" v-for="(n,index) in classDetail.list" :key="index" :class="{'active': n.active}">
                <router-link :to="'/train/'+$route.params.id+'/play/'+n.id"><h4><span>{{ n.name }}</span></h4></router-link>
              </div>
            </div>
          </div>
          </vue-scroll>
        </div>
        <div class="course-show" v-show="!showList" @click="showList = true,dragMinWidth = 400,dragWidth = 400"><span class="el-icon-back"></span></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "trainPlayer",
  data() {
    return {
      fullHeight: '',
      classDetail: {
        name: '',
        url: '',
        id: '',
        ali_playauth: '',
        list: [],
        link: '',
        isbuy: false
      },
      showList: true,
      dragMinWidth: 400,
      dragWidth: 400,
      isshow: false
    }
  },
  directives: {
    drag:(el, binding) => {
      el.onmousedown = (ed) => {
        document.onmousemove = (em) => {
          document.getElementById('drag').style.width = document.documentElement.clientWidth - em.clientX+'px';
        }
        document.onmouseup = (eu) => {
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
  },
  mounted() {
    this.getMessage()
    this.handleResize()
    window.onresize = () => {
      this.handleResize()
    }
  },
  methods: {
    getMessage() {
      if(!localStorage.getItem('userid') || !localStorage.getItem('token')) {
        this.$confirm('本视频需要登录后才可以播放, 是否登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/login')
        }).catch(() => {
          this.$router.go(-1);
        })
        return false;
      }
      this.$ajax('/course/hourdetail/'+this.$route.params.playid,{
        params: {
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token')
        }
      }).then((res) => {
        // console.log(res)
        this.$NProgress.done()
        this.isshow = true
        if(res.data.result === 'success') {
          let item = {},arr = [];
          for(let i = 0;i < res.data.data.catalog.length;i ++) {
            item = {
              name: res.data.data.catalog[i].classes_hour_name,
              id: res.data.data.catalog[i].id,
              isfree: res.data.data.catalog[i].is_free === 1 ? true : false,
              active: res.data.data.catalog[i].id === parseInt(this.$route.params.playid) ? true : false
            }
            arr.push(item)
          }
          this.classDetail = {
            name: res.data.data.classes_hour_name,
            url: res.data.data.classes_url,
            id: res.data.data.id,
            ali_playauth: res.data.data.ali_playauth,
            list: [...arr],
            link: res.data.data.classes_courseware ? this.$imageHost+res.data.data.classes_courseware : '',
            isbuy: res.data.data.is_buy === 0 ? false : true
          }
          setTimeout(() => {
            this.aliPlay()
          }, 0)
          localStorage.setItem('token',res.data.authToken)
        }else {
          if(res.data.data.errno === '-10002') {
            localStorage.setItem('token','');
            localStorage.setItem('userid','');
            this.$alert('当前登录已失效, 请重新登录', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push('/login')
              }
            });
          }else if(res.data.data.errno === '-20011') {
            this.$confirm('本视频需要购买后才可以播放, 是否购买?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$router.push('/train/'+this.$route.params.id+'/buy')
            }).catch(() => {
              this.$router.go(-1);
            });
          }else {
            this.$message.error(res.data.data.errmsg)
          }
        }
      }).catch((error) => {
        if(error.response) {
          this.$message.error(error.response.data.message)
        }
      })
    },
    handleResize() {
      let fullHeight = document.documentElement.clientHeight;
      let fullWidth = document.documentElement.clientWidth;
      this.fullHeight = fullHeight - 57 + 'px';
      // this.playerOptions.width = fullWidth - 400 - 50;
    },
    aliPlay() {
      var player = new Aliplayer({
        id: "J_prismPlayer",
        width: "100%",
        height: "100%",
        autoplay: false,
        vid: this.classDetail.url,
        playauth: this.classDetail.ali_playauth
      },function(player){
        console.log('播放器创建了');
      });
    }
  },
  watch: {
    $route() {
      Object.assign(this.$data, this.$options.data())
      this.getMessage()
      this.handleResize()
    }
  }
};
</script>

<style lang='less'>
.train-player {
  width: 100%;
  background: #2e2e36;
  .train-player-content {
    display: flex;
    justify-content: space-between;
    height: 100%;
    .player {
      width: 100%;
      position: relative;
      padding-left: 50px;
      flex: 1;
      z-index: 1;
      .player-title {
        background-color: #2B333F;
        color: #fff;
        line-height: 36px;
        padding: 0 90px 0 20px;
        position: absolute;
        z-index: 2;
        top: 0;
        left: 50px;
        right: 0;
        overflow: hidden;
        a.download-btn {
          display: inline-block;
          position: absolute;
          z-index: 3;
          top: 6px;
          right: 20px;
          background: #fff;
          border-radius: 4px;
          line-height: 24px;
          font-size: 12px;
          color: #666;
          padding: 0 10px;
        }
      }
      .video-player {
        background: #2e2e36;
        position: absolute;
        top: 36px;
        left: 50px;
        bottom: 0;
        right: 0;
      }
      .video-js {
        width: 100%!important;
        height: 100%!important;
      }
      .prism-player {
        overflow: hidden;
      }
    }
    .player-list {
      max-width: 900px;
      position: relative;
      border-left: 1px solid #000;
      .course-drag {
        position: absolute;
        left: 0;
        top: 0;
        width: 10px;
        height: 100%;
        cursor: col-resize;
        z-index: 2;
        .drag {
          position: absolute;
          top: 50%;
          margin-top: -20px;
          left: 3px;
          width: 4px;
          height: 40px;
          border: 1px solid #626972;
          border-width: 0 1px;
        }
      }
      .course-show {
        position: absolute;
        left: 0;
        top: 0;
        width: 49px;
        height: 100%;
        z-index: 2;
        span {
          position: absolute;
          top: 50%;
          margin-top: -12px;
          left: 3px;
          width: 24px;
          height: 24px;
          cursor: pointer;
          font-size: 24px;
        }
      }
      .play-list-main {
        position: absolute;
        z-index: auto;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .play-list-content {
          position: relative;
          padding: 32px;
          .play-list-close {
            font-size: 24px;
            text-align: right;
            position: absolute;
            top: 7px;
            right: 33px;
            span {
              cursor: pointer;
            }
          }
          .item {
            user-select: none;
            margin: 15px 0;
            a span {
              transition: all 0.3s;
            }
          }
          .item:hover a span {
            color: #fff;
          }
          .item.active a span {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
