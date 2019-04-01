<template>
  <div class="hello">
    <div class="profile" v-show="pageReady">
      <div class="app-head-profile">
        <div class="app-head-profile-main">
          <div class="profile-main-left">
            <img :src="message.img" width="436" alt="">
          </div>
          <div class="profile-main-mid">
            <h2><span>{{ message.title }}</span></h2>
            <div class="p1">
              <span class="numbers">{{ message.buy }}人学习</span><span class="comment">{{ message.comment }}人评论</span><span class="classes">共{{ message.classes }}课时</span>
            </div>
            <div class="p2"><span>￥{{ message.price }}</span><span v-show="message.type === 2 && message.address">地址：{{ message.address }}</span></div>
            <div class="p3">
              <el-button type="primary" class="isbuy" v-if="message.isbuy">已购买</el-button>
              <el-button type="primary" @click="buy" v-else>立即购买</el-button>
              <el-button v-if="message.type === 1 && showFree && !message.isbuy" @click="freeWatch()">免费试听</el-button>
              <span class="haslike" v-if="message.islike" @click="like">已收藏</span>
              <span class="like" v-else @click="like">收藏课程</span>
            </div>
          </div>
          <div class="profile-main-right">
            <div class="main-right-share">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <span class="share-icon"></span>分享至<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <share v-if="shareConfig.show" :config="shareConfig"></share>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="main-right-code" v-show="message.isbuy && message.type === 2">
              <div class="user-code"><qriously :value="qrcode.value" :size="qrcode.size" :backgroundAlpha="qrcode.backgroundAlpha"/></div>
              <h4><span>我的二维码</span></h4>
            </div>
          </div>
        </div>
      </div>
      <div class="app-body-profile">
        <div class="app-body-profile-content">
          <div class="app-body-profile-left">
            <div class="main-content-body" id="introduce">
              <div class="main-content-head">
                <a href="javascript:;" :class="{'active':item.active}" @click="toPosition(index)" v-for="(item,index) in classType" :key="index"><span>{{ item.name }}</span></a>
              </div>
              <div class="main-content-text" v-html="message.desc"></div>
            </div>
            <div class="main-content-body" id="classes">
              <div class="main-content-head">
                <a href="javascript:;" class="active"><span>课程课时</span></a>
              </div>
              <div class="main-content-list">
                <div class="main-content-list-item" v-for="(h,index) in hour" :key="index">
                  <div class="list-item-left">
                    <a @click.prevent="trainToPlay(h.link, h.id, h.isfree)" v-if="message.type === 1"><span>第{{ index+1 }}节</span><span class="title">{{ h.name }}</span></a>
                    <a @click.prevent v-else><span>第{{ index+1 }}节</span><span class="title">{{ h.name }}</span></a>
                  </div>
                  <div class="list-item-right">
                    <router-link :to="h.link"><span class="free" v-show="h.isfree && !message.isbuy">免费试听</span></router-link>
                    <a @click.prevent="trainToPlay(h.link, h.id, h.isfree)" v-show="message.type === 1"><i class="play"></i></a>
                    <!-- <span class="time">2018-8-1 10:00-12:00</span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="main-content-body" id="comment">
              <div class="main-content-head">
                <a href="javascript:;" class="active"><span>课程评论</span></a>
              </div>
              <div class="main-content-list">
                <div class="main-content-comment-item" v-for="(c,index) in comment.list" :key="index">
                  <div class="list-item-left">
                    <div>
                      <div class="user-photo">
                        <img :src="c.img" width="50" height="50" alt="">
                      </div>
                    </div>
                    <div class="list-item-mid">
                      <h4><span>{{ c.name }}</span></h4>
                      <p>{{ c.content }}</p>
                    </div>
                  </div>
                  <div class="list-item-right">
                    <span class="time">{{ c.time }}</span>
                  </div>
                </div>
              </div>
              <div class="main-content-foot">
                <div class="more"><span @click="moreComment()" v-if="comment.list.length >= 5">查看更多评论</span></div>
                <div class="post-comment" v-if="message.isbuy">
                  <el-input type="textarea" placeholder="请输入内容(200字以内)" v-model="comment.text" maxlength=200></el-input>
                  <el-button type="primary" @click="postComment()">发表</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="app-body-profile-right">
            <div class="main-content-body" id="teacher">
              <div class="main-content-head">
                <a href="javascript:;" class="active"><span>授课老师</span></a>
              </div>
              <div class="main-content-teacher">
                <div class="photo">
                  <router-link :to="{path:'/expert/information',query:{id:message.professor_id}}" v-if='message.is_professor'><img :src="message.avatar" alt=""></router-link>
                  <router-link to="" v-else><img :src="message.avatar" alt=""></router-link>
                </div>
                <p class="name" v-if='message.is_professor'><router-link :to="{path:'/expert/information',query:{id:message.professor_id}}"><span>{{ message.professor }}</span></router-link></p>
                <p class="name" v-else><router-link to=""><span>{{ message.professor }}</span></router-link></p>
                <p class="desc"><span>{{ message.position }}</span></p>
                <p class="desc"><span>{{ message.intro }}</span></p>
              </div>
            </div>
            <div class="main-content-body" id="more">
              <div class="main-content-head">
                <a href="javascript:;" class="active"><span>看了这门课的人还看了</span></a>
              </div>
              <div class="main-content-more">
                <div class="main-content-more-li" v-for="(n,index) in classes" :key="index">
                  <router-link :to="{ name: 'trainProfile', params: { id: n.id }}">
                  <div class="left">
                    <div class="left-image"><img :src="n.img" width="88" alt=""></div>
                  </div>
                  <div class="right">
                    <div class="title"><h4><span>{{ n.name }}</span></h4></div>
                    <div class="hot"><span>{{ n.num }}人学习</span></div>
                  </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
const defaultImage = require('../assets/defaultclass.jpg')
const defaultImageUser = require('../assets/defaultuser.jpg')
const defaultImageList = require('../assets/defaultclasses.jpg')
export default {
  name: 'trainProfile',
  data () {
    return {
      shareConfig: {
        url: window.location.href,
        source: '',
        title: '',
        description: '',
        image: '',
        sites: ['wechat','qq', 'weibo'],
        wechatQrcodeTitle: '微信扫一扫：分享',
        wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
        show: false
      },
      classType:[{
        name: '课程介绍', active: true, id: 'introduce'
      }, {
        name: '课程课时', active: false, id: 'classes'
      }, {
        name: '课程评论', active: false, id: 'comment'
      }],
      message: {
        img: defaultImage,
        title: '',
        buy: 0,
        comment: 0,
        classes: 0,
        price: 0,
        isbuy: false,
        islike: false,
        type: '',
        id: '',
        desc: '',
        is_professor: '',
        professor: '昵称',
        intro: '',
        position: '',
        avatar: defaultImageUser,
        professor_id: '',
        address: '',
        order: ''
      },
      pageReady: false,
      hour: [],
      comment: {
        list: [],
        l: 5,
        p: 1,
        text: ''
      },
      classes: [],
      showFree: false,
      qrcode: {
        value: '',
        size: 96,
        backgroundAlpha: 1
      }
    }
  },
  mounted () {
    this.getMessage()
  },
  watch: {
    $route() {
      Object.assign(this.$data, this.$options.data())
      this.getMessage()
    }
  },
  methods: {
    getMessage() {
      axios.all([this.$ajax.get('/course/detail/'+this.$router.history.current.params.id,{
        params: {
          user_id: localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || ''
        }
      }),this.$ajax('/course/commentlist/'+this.$router.history.current.params.id+'?l=5&p=1'),this.$ajax('/course/klyk/'+this.$router.history.current.params.id)])
      .then(axios.spread((detail, comment,classes) => {
        this.getDeatil(detail);
        this.getComment(comment);
        this.getClasses(classes);
      })).catch((error) => {
        // console.log(error)
      })
    },
    getDeatil(res) {
      // console.log(res);
      if(res.data.result === 'success') {
        this.$NProgress.done();
        this.pageReady = true;
        const data = res.data.data;
        localStorage.setItem('token',data.token || '');
        this.message = {
          img: data.detail.classes_img ? this.$getImageUrl(data.detail.classes_img,436,330) : defaultImage,
          title: data.detail.classes_title,
          buy: data.detail.buy_num,
          comment: 0,
          classes: data.hour.length,
          price: data.detail.classes_price,
          isbuy: data.is_buy === 0 ? false : true,
          islike: data.is_favor === 0 ? false : true,
          type: data.detail.classes_type,
          id: this.$route.params.id,
          desc: data.detail.classes_description,
          is_professor: data.detail.is_professor === 1 ? true : false,
          professor: data.detail.professor || '昵称',
          intro: data.detail.professor_intro,
          position: data.detail.professor_position,
          avatar: data.detail.professor_avatar ? this.$imageHost+data.detail.professor_avatar : defaultImageUser,
          professor_id: data.detail.professor_id || '',
          address: data.detail.classes_address,
          order: data.order_id
        };
        this.shareConfig = {
          url: window.location.href,
          source: '',
          title: data.detail.classes_title,
          description: data.detail.classes_title,
          image: data.detail.classes_img ? this.$imageHost+data.detail.classes_img : defaultImage,
          sites: ['wechat','qq', 'weibo'],
          show: true
        };
        let item = {},arr = [];
        for(let i = 0;i < data.hour.length;i ++) {
          item = {
            name: data.hour[i].classes_hour_name,
            id: data.hour[i].id,
            classid: data.hour[i].classes_id,
            isfree: data.hour[i].is_free === 1 ? true : false,
            link: this.message.isbuy ? ('/train/'+this.message.id+'/play/'+data.hour[i].id) : ( data.hour[i].is_free === 1 ? ('/train/'+this.message.id+'/play/'+data.hour[i].id) : '' )
          }
          arr.push(item)
          if(data.hour[i].is_free === 1) {
            this.showFree = true
          }
        }
        this.hour = arr.sort(this.arraySort('id'));
        this.qrcode.value = 'https://'+window.location.host+'/#/m/train/'+this.$route.params.id+'/order/'+this.message.order;
      }else {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.$router.go(-1);
          }
        });
      }
    },
    getComment(res) {
      // console.log(res)
      if(res.data.result === 'success') {
        let data = res.data.data.data;
        let item = {},arr = [];
        for(let i = 0;i < data.length;i ++) {
          item = {
            img: data[i].avatar ? this.$imageHost+data[i].avatar : defaultImageUser,
            name: data[i].nickname || '昵称',
            content: data[i].content,
            time: data[i].created_at
          }
          arr.push(item)
        }
        this.comment.list = arr;
        this.message.comment = res.data.data.total;
        this.comment.p = this.comment.p + 1;
      }
    },
    getClasses(res) {
      // console.log(res)
      let data = res.data.data;
      let item = {},arr = [];
      for(let i = 0;i < data.length;i ++) {
        item = {
          img: data[i].classes_img ? this.$getImageUrl(data[i].classes_img,88,62) : defaultImageList,
          name: data[i].classes_title,
          num: data[i].buy_num,
          id: data[i].id
        }
        arr.push(item)
      }
      this.classes = arr;
    },
    toPosition(index) {
      for(let i = 0;i < this.classType.length;i ++) {
        this.classType[i].active = false
      }
      this.classType[index].active = true;
      let top = document.getElementById(this.classType[index].id).offsetTop - 57;
      Event.$emit('tabScrollTop',top)
    },
    buy() {
      if(this.haslogin()) {
        this.$router.push('/train/'+this.$router.history.current.params.id+'/buy')
      }
    },
    haslogin() {
      if(localStorage.getItem('token') && localStorage.getItem('userid')) {
        return true
      }else {
        this.$confirm('您还没有登录, 是否登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/login')
        }).catch(() => {

        });
        return false
      }
    },
    like() {
      if(this.haslogin()) {
        this.$ajax.post('/course/savefavor',{
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token'),
          id: this.message.id,
          t: this.message.islike ? 'cancel' : 'add'
        }).then((res) => {
          // console.log(res)
          if(res.data.result === 'success') {
            if(this.message.islike) {
              this.$message({ message: '取消收藏成功', type: 'success' })
              this.message.islike = false;
              localStorage.setItem('token',res.data.data.token)
            }else {
              this.$message({ message: '收藏成功', type: 'success' })
              this.message.islike = true;
              localStorage.setItem('token',res.data.data.token)
            }
          }else {
            if(res.data.data.errno === '-10002') {
              localStorage.setItem('token','');
              localStorage.setItem('userid','');
              this.$confirm('当前登录已失效, 是否重新登录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push('/login')
              }).catch(() => {

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
      }
    },
    freeWatch() {
      if(this.haslogin()) {
        let id = '',hourid = '';
        for(let i = this.hour.length - 1;i >= 0;i --) {
          if(this.hour[i].isfree) {
            id = this.hour[i].id;
            hourid = this.hour[i].classid;
          }
        }
        this.$router.push('/train/'+this.message.id+'/play/'+id)
      }
    },
    arraySort(prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (val1 < val2) {
          return -1;
        } else if (val1 > val2) {
          return 1;
        } else {
          return 0;
        }
      }
    },
    moreComment() {
      this.$ajax('/course/commentlist/'+this.$route.params.id,{
        params: {
          l: this.comment.l,
          p: this.comment.p
        }
      }).then((res) => {
        // console.log(res)
        if(res.data.result === 'success') {
          let data = res.data.data.data;
          if(data.length) {
            let item = {},arr = [];
            for(let i = 0;i < data.length;i ++) {
              item = {
                img: data[i].avatar ? this.$imageHost+data[i].avatar : defaultImageList,
                name: data[i].nickname || '昵称',
                content: data[i].content,
                time: data[i].created_at
              }
              arr.push(item)
            }
            this.comment.list = this.comment.list.concat(arr);
            this.comment.p = this.comment.p + 1;
          }else {
            this.$message('没有更多了!')
          }
        }
      }).catch((error) => {
        // console.log(error)
      })
    },
    postComment() {
      if(this.haslogin()) {
        this.$ajax.post('/course/commentsubmit',{
          id: this.$route.params.id,
          msg: this.comment.text,
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token')
        }).then((res) => {
          // console.log(res)
          if(res.data.result === 'success') {
            this.$message({message : '发表评论成功', type: 'success'});
            this.$ajax('/course/commentlist/'+this.$route.params.id,{
              params: {
                l: this.comment.l,
                p: 1
              }
            }).then((res) => {
              this.comment.l = 5;
              this.comment.p = 1;
              this.comment.text = '';
              this.getComment(res)
            })
          }else {
            if(res.data.data.errno === '-10002') {
              localStorage.setItem('token','');
              localStorage.setItem('userid','');
              this.$confirm('当前登录已失效, 是否重新登录?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push('/login')
              }).catch(() => {

              });
            }else {
              this.$message.error(res.data.data.errmsg)
            }
          }
        })
      }
    },
    trainToPlay(link, id, isfree) {
      if(this.message.isbuy) {
        this.$router.push(link)
      }else {
        if(isfree) {
          this.$router.push(link)
        }else {
          this.$confirm('该课程需要购买才可以观看, 是否购买?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.buy()
          }).catch(() => {

          });
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.el-dropdown-menu {
  padding: 10px!important;
  .social-share .icon-wechat .wechat-qrcode {
    top: 40px;
  }
  .social-share .icon-wechat .wechat-qrcode:after {
    bottom: 190px;
    transform: rotate(180deg);
  }
}
.profile{
  .app-head-profile {
    display: flex;
    background: white;
    border-bottom: 1px solid #dadada;
    justify-content: center;
    .app-head-profile-main {
      padding: 60px 0;
      display: flex;
      justify-content: space-between;
      @media screen and ( min-width: 1380px ) {
        width: 1380px;
      }
      @media screen and ( max-width: 1380px ) {
        width: 1200px;
      }
      .profile-main-left{
        width: 436px;
        height: 330px;
        overflow: hidden;
        margin-right: 20px;
      }
      .profile-main-right {
        min-width: 200px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        padding: 18px 0;
        .main-right-share {
          display: flex;
          justify-content: center;
          .el-dropdown { width: 140px;text-align: center }
          span.share-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url('../assets/Share.png') no-repeat center center;
            background-size: 100% 100%;
            margin-right: 5px;
          }
          span.el-dropdown-link {
            font-size: 16px;
            color: #999;
            cursor: pointer;
          }
        }
        .main-right-code {
          text-align: center;
          .user-code {
            width: 104px;
            height: 104px;
            background: white;
            border-radius: 2px;
            box-shadow: 0 0 5px #ccc;
            padding: 4px;
            margin: 10px auto;
          }
        }
      }
      .profile-main-mid {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 670px;
        padding: 18px 0;
        h2 {
          color: #333;
          font-weight: bold;
        }
        .p1 {
          display: flex;
          span {
            color: #999;
            font-size: 16px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            position: relative;
            padding: 0 15px 0 30px;
            margin-right: 15px;
          }
          .numbers::before {
            content: '';
            width: 25px;
            height: 16px;
            background: url('../assets/View.png') no-repeat center center;
            position: absolute;
            left: 0;
            top: 3px;
          }
          .numbers::after {
            content: '';
            width: 1px;
            height: 14px;
            background: #999;
            position: absolute;
            right: 0;
            top: 5px;
          }
          .comment::before {
            content: '';
            width: 18px;
            height: 16px;
            background: url('../assets/comment.png') no-repeat center center;
            background-size: 100% 100%;
            position: absolute;
            left: 0;
            top: 3px;
          }
          .comment::after {
            content: '';
            width: 1px;
            height: 14px;
            background: #999;
            position: absolute;
            right: 0;
            top: 5px;
          }
          .classes::before {
            content: '';
            width: 16px;
            height: 16px;
            background: url('../assets/Newspaper.png') no-repeat center center;
            background-size: 100% 100%;
            position: absolute;
            left: 0;
            top: 3px;
          }
        }
        .p2 {
          span:nth-child(1) {
            color: #ff9000;
            font-size: 26px;
          }
          span:nth-child(2) {
            margin-left: 50px;
            font-size: 16px;
            color: #666;
          }
        }
        .p3 {
          .like {
            display: inline-block;
            padding-left: 30px;
            background: url('../assets/sc.png') no-repeat left center;
            cursor: pointer;
            background-size: 20px;
            color: #666;
            margin-left: 10px;
            transition: all 0.15s;
          }
          .like:hover {
            color: #fed900;
            background: url('../assets/sc_icon.png') no-repeat left center;
            background-size: 20px;
          }
          .haslike {

            display: inline-block;
            padding-left: 30px;
            background: url('../assets/sc_icon.png') no-repeat left center;
            cursor: pointer;
            background-size: 20px;
            color: #fed900;
            margin-left: 10px;
            transition: all 0.15s;
          }
          .isbuy {
            background: #ccc;
            border-color: #ccc;
          }
        }
      }
    }
  }
  .app-body-profile {
    display: flex;
    justify-content: center;
    margin: 20px 0;
    .app-body-profile-content {
      @media screen and ( min-width: 1380px ) {
        width: 1380px;
      }
      @media screen and ( max-width: 1380px ) {
        width: 1200px;
      }
      display: flex;
      justify-content: space-between;
      .main-content-body {
        background-color: #fff;
        border-radius: 4px;
        margin-bottom: 20px;
        .main-content-head {
          padding: 20px;
          font-size: 16px;
          line-height: 40px;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          a {
            display: flex;
            margin-right: 30px;
            color: #999;
          }
          a.active {
            color: #333;
            font-weight: bold;
            transition: all 0.15s;
            span::after {
              content: '';
              height: 2px;
              background-color: #fed900;
              width: 100%;
              display: flex;
            }
          }
        }
      }
      .app-body-profile-left {
        width: 1018px;
        margin-right: 20px;
        .main-content-text {
          padding: 50px;
        }
        .main-content-list {
          .main-content-list-item {
            height: 68px;
            padding: 0 60px 0 20px;
            border-top: 1px solid #eee;
            line-height: 68px;
            display: flex;
            justify-content: space-between;
            .list-item-left {
              a {
                color: #333;
                transition:all .15s;
                display: flex;
                cursor: pointer;
                span.title {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: 350px;
                  margin-left: 10px;
                }
              }
              a:hover {
                color: #fed900;
              }
            }
            .list-item-right {
              display: flex;
              a {
                margin-right: 20px;
                cursor: pointer;
                span.free {
                  color: #d57723;
                }
                i.play {
                  width: 18px;
                  height: 18px;
                  background: url('../assets/Play.png') no-repeat center center;
                  display: inline-block;
                  margin-top: 25px;
                }
              }
            }
          }
          .main-content-list-item:hover {
            background-color: #f9f9f9;
          }
          .main-content-comment-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding: 30px 60px 30px 20px;
            .list-item-left {
              display: flex;
              .user-photo {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 20px;
                img {
                  width: 100%;
                }
              }
              h4 span {
                font-size: 12px;
              }
              p {
                margin: 8px 0;
                color: #333;
              }
            }
            .list-item-right {
              min-width: 160px;
              text-align: right;
              font-size: 12px;
            }
          }
          .main-content-comment-item:last-child {
            border: none;
          }
        }
        .main-content-foot {
          padding:20px;
          border-top: 1px solid #eee;
          .more {
            line-height: 50px;
            color: #d57723;
            text-align: center;
            span {
              cursor: pointer;
            }
          }
          .post-comment {
            text-align: right;
            button {
              margin-top: 10px;
            }
          }
        }
      }
      .app-body-profile-right {
        width: 342px;
        .main-content-teacher {
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .photo {
            display: flex;
            justify-content: center;
            a {
              display: flex;
              width: 134px;
              height: 134px;
              border-radius: 50%;
              overflow: hidden;
              border: 5px solid #fed900;
              img {
                width: 100%;
              }
            }
          }
          p.name{
            text-align: center;
          }
          p.name span {
            color: #2f2e2e;
            font-size: 14px;
          }
          p {
            font-size: 12px;
          }
          .skills {
            border-top: 1px solid #eee;
          }
        }
        .main-content-more {
          .main-content-more-li {
            border-bottom: 1px solid #eee;
            padding: 30px 20px;
            a {
              display: flex;
              max-width: 100%;
              justify-content: space-between;
              .left {
                .left-image {
                  width: 88px;
                  height: 62px;
                  overflow: hidden;
                  img {
                    width: 100%;
                  }
                }
              }
              .right {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                width: 190px;
                .title span {
                  color: #333;
                }
                .hot {
                  text-align: right;
                  color: #999;
                  font-size: 12px;
                  span::before {
                    display: inline-block;
                    content:'';
                    width: 12px;
                    height: 12px;
                    background: url('../assets/UserProfile.png') no-repeat center center;
                    background-size: 100% 100%;
                    margin-right: 5px;
                  }
                }
              }
            }
          }
          .main-content-more-li:last-child {
            border-bottom: none;
          }
        }
      }
    }
  }
}
</style>
