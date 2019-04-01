<template>
<div class="home-main" v-show="pageReady">
<div class="home-content">
  <div class="home-main-banner">
    <div class="banner-content">
      <div class="banner-content-box">
        <el-carousel indicator-position="outside" :height="bannerHeight+'px'">
          <el-carousel-item v-for="(item,index) in bannerList" :key="index">
            <a :href="item.link" target="_blank" v-if='item.hasLink'><img :src="item.img" alt="" :title="item.name"></a>
            <router-link to="/" v-else><img :src="item.img" alt="" :title="item.name"></router-link>
          </el-carousel-item>
        </el-carousel>
        <div class="banner-bottom">
          <div class="white"></div><div class="grey"></div><div class="yellow"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="home-main-hotclass">
    <div class="hotclass-content">
      <div class="main-content-head">
        <div class="content-head-image"><img src="../assets/hotcourses.png" alt=""></div>
        <div class="content-head-right">
          <div class="line"></div>
          <div class="more"><router-link to="/train"><span>MORE</span></router-link></div>
        </div>
      </div>
      <div class="hotclass-content-list">
        <div class="hotclass-list-li" v-for="(item,index) in classList" :key="index">
          <router-link :to="'/train/'+item.id">
            <div class="hotclass-list-li-img">
              <img :src="item.img" alt="" width="330">
            </div>
            <div class="hotclass-list-li-text">
              <h4><span>{{ item.name | textOverflow(36) }}</span></h4>
              <h4><span>课程讲师：</span><span>{{ item.expert }}</span></h4>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="home-class-expert">
    <div class="main-content-head">
      <div class="content-head-image"><img src="../assets/hotexperts.png" alt=""></div>
      <div class="content-head-right">
        <div class="line"></div>
      </div>
    </div>
    <div class="home-class-expert-body">
      <div class="home-class-expert-left">
        <div class="expert-left-mid">
          <div class="expert-left-mid-user">
            <div class="message" v-if="expertList.length">
              <h3><span>{{ expertList[activeExpert].name }}</span></h3>
              <p class="position">
                <span v-show="expertList[activeExpert].company">{{ expertList[activeExpert].company }}</span>
                <span v-show="expertList[activeExpert].position">{{ expertList[activeExpert].position }}</span>
              </p>
              <p class="description" v-show="expertList[activeExpert].description"><span>{{ expertList[activeExpert].description | textOverflow(100) }}</span></p>
            </div>
          </div>
          <div class="expert-left-mid-user-profile">
            <div class="profile" v-if="expertList.length"><router-link :to="{path:'/expert/information',query:{id:expertList[activeExpert].id}}"><img :src="expertList[activeExpert].img" alt="" width="356" height="356"></router-link></div>
            <div class="more">
              <router-link to="/expert">
                <span>MORE</span>
              </router-link>
            </div>
          </div>
          <!-- <div class="expert-left-mid-user">
            <div class="more">
              <router-link to="/expert">
                <div class="p1"><span>MORE</span></div><div class="p2"><span>更多专家</span></div>
              </router-link>
            </div>
            <div class="profile" v-if="expertList.length"><router-link :to="{path:'/expert/information',query:{id:expertList[activeExpert].id}}"><img :src="expertList[activeExpert].img" alt="" width="356" height="356"></router-link></div>
            <div class="message" v-if="expertList.length">
              <h3><span>{{ expertList[activeExpert].name }}</span></h3>
              <p v-show="expertList[activeExpert].position"><span>{{ '职位：'+expertList[activeExpert].position }}</span></p>
              <p v-show="expertList[activeExpert].company"><span>{{ '公司：'+expertList[activeExpert].company }}</span></p>
              <p v-show="expertList[activeExpert].skill"><span>{{ '技能：'+expertList[activeExpert].skill }}</span></p>
            </div>
          </div> -->
          <!-- <div class="expert-left-mid-list">
            <div class="list-profile" :class="{'active':index === activeExpert}" v-for="(item,index) in expertList" :key="index" v-if="index < 3" @click="chooseExpert(index)">
              <img :src="item.img" alt="" width="90" height="90">
            </div>
          </div> -->
        </div>
        <div class="expert-left-foot">
          <div class="list-profile" :class="{'active':index === activeExpert}" v-for="(item,index) in expertList" :key="index" v-if="index >= 0" @click="chooseExpert(index)">
            <img :src="item.img" alt="" width="156" height="156">
          </div>
          <!-- <div class="foot-li" :class="{'active':index === activeExpert}" v-for="(item,index) in expertList" :key="index" v-if="index >= 3">
            <div class="foot-li-top" :style="{backgroundImage: 'url('+item.bg+')' }">
              <div class="foot-li-bg"></div>
              <div class="foot-li-image"><router-link :to="{path:'/expert/information',query:{id:item.id}}"><img :src="item.img" alt="" width="80" height="80"></router-link></div>
            </div>
            <div class="foot-li-message">
              <h4><span>{{ item.name }}</span></h4>
              <p><span>{{ item.position }}</span></p>
              <div class="foot-li-button">
                <router-link :to="{path:'/expert/information',query:{id:item.id}}"><el-button type="primary"></el-button></router-link>
              </div>
            </div>
          </div> -->
        </div>
      </div>
      <div class="home-class-expert-right">
        <div class="expert-right-head">
          <div class="expert-right-head-image">
            <img src="../assets/answers.png" alt="">
          </div>
          <div class="expert-right-head-btn">
            <el-button @click="changeQuestonList()"><i class="el-icon-fresh" :style="'transform:rotate('+showQuestion.rotate+'deg)'"></i>换一批</el-button>
          </div>
        </div>
        <div class="expert-right-list">
          <div class="right-list-li" v-for="(item,index) in questionList" :key="index" v-show="index >= showQuestion.low && index < showQuestion.high">
            <div class="list-li-left">
              <h4><router-link :to="{path:'/expert/answer',query:{id:item.id}}"><span>{{ item.title | textOverflow(45) }}</span></router-link></h4>
            </div>
            <div class="list-li-right">
              <div class="image"><img :src="item.img" width="30" height="30" alt=""></div>
              <div class="text">
                <h4><span>{{ item.name }}</span><span>{{ item.position }}</span></h4>
                <span class="look" :title="item.look+'人已付费查看回答'">{{ item.look }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="activities-main">
    <div class="main-content-head">
      <div class="content-head-image"><img src="../assets/recent.png" alt=""></div>
      <div class="content-head-right">
        <div class="line"></div>
        <div class="more"><router-link to="/activity"><span>MORE</span></router-link></div>
      </div>
    </div>
    <div class="activities-content">
      <div class="activities-item" v-for="(a,index) in activityList" :key="index">
        <router-link :to="{path: '/activity/details', query: {id: a.id}}">
          <div class="item-image">
            <img :src="a.img" width="220" alt="">
          </div>
        </router-link>
        <div class="item-content">
          <h3><router-link :to="{path: '/activity/details', query: {id: a.id}}"><span>{{ a.title }}</span></router-link></h3>
          <p><span v-html="a.content"></span></p>
          <p><span>发布日期：{{ a.time }}</span><span>浏览：{{ a.look }}人</span></p>
        </div>
      </div>
    </div>
  </div>

</div>
</div>
</template>

<script>
import axios from 'axios'
const defaultImageList = require('../assets/defaultclasses.jpg')
const defaultImageUser = require('../assets/defaultuser.jpg')
export default {
  name: 'index',
  data () {
    return {
      bannerList: [],
      classList: [],
      lineWidth: '10%',
      expertList: [],
      activeExpert: 0,
      questionList: [],
      showQuestion: {
        low: 0,
        high: 6,
        rotate: 0
      },
      pageReady: false,
      bannerHeight: 534,
      activityList: []
    }
  },
  mounted () {
    this.getMessage()
    window.onresize = () => {
      let w = document.documentElement.clientWidth;
      w = w > 1380 ? 1380 : (w < 1200 ? 1200 : w);
      let h = parseInt(w * (534/1380));
      this.bannerHeight = h;
    }
  },
  methods: {
    getMessage() {
      axios.all([this.$ajax('/ads/index?l=20'),this.$ajax('/course/recom'),this.$ajax('/expert/recom?l=5'),this.$ajax('/qa/recom?l=18',{
        params: {
          user_id: localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || ''
        }
      }),this.$ajax('/activitys/list?l=4')]).then(axios.spread((banner, classes,expert,question,activities ) => {
        this.getBanner(banner.data);
        this.getClass(classes.data);
        this.getExpert(expert.data);
        this.getQuestion(question.data);
        this.getActivity(activities.data);
        this.$NProgress.done();
        this.lineWidth = '70%';
        this.pageReady = true;
      })).catch(axios.spread((banner,classes,expert,question) => {
        console.log('banner:' + banner + 'classes:' + classes + 'expert:' + expert + 'question:' + question)
      }))
    },
    getBanner(res) {
      // console.log(res)
      let list = res.data;
      let li = {},arr = [];
      let w = document.documentElement.clientWidth;
      w = w > 1380 ? 1380 : (w < 1200 ? 1200 : w);
      let h = parseInt(w * (534/1380));
      this.bannerHeight = h;
      for(let i = 0;i < list.length;i ++) {
        li = {
          img: this.$getImageUrl(list[i].ad_img,w,h),
          link: list[i].ad_url,
          rank: list[i].ad_rank,
          name: list[i].ad_name,
          id: list[i].id,
          hasLink: list[i].ad_url === '#' ? false : true
        }
        arr.push(li);
      }
      this.bannerList = arr.sort(this.arraySort('rank'));
    },
    getExpert(res) {
      // console.log(res)
      let list = res.data;
      let li = {},arr = [];
      for(let i = 0;i < list.length;i ++) {
        li = {
          img: list[i].avatar ? this.$getImageUrl(list[i].avatar,356,356) : defaultImageUser,
          position: list[i].company_position,
          name: list[i].name,
          id: list[i].user_id,
          company: list[i].company,
          description: list[i].description,
          bg: list[i].one_project ? (list[i].one_project.project_img ? this.$getImageUrl(list[i].one_project.project_img,246,162) : '') : ''
        }
        arr.push(li);
      }
      this.expertList = arr;
    },
    getQuestion(res) {
      // console.log(res)
      let list = res.data;
      let li = {},arr = [];
      for(let i = 0;i < list.length;i ++) {
        li = {
          img: list[i].answer_user_avatar ? this.$imageHost+list[i].answer_user_avatar : defaultImageUser,
          position: list[i].answer_user_position,
          name: list[i].answer_user_name || '昵称',
          id: list[i].id,
          userid: list[i].answer_user_id,
          title: list[i].ask_title,
          look: list[i].buy_num
        }
        arr.push(li);
      }
      this.questionList = arr;
    },
    getActivity(res) {
      if(res.data.length === 0) {
        return false;
      }
      let list = res.data.data;
      let li = {},arr = [];
      for(let i = 0;i < list.length;i ++) {
        li = {
          img: list[i].event_image ? this.$getImageUrl(list[i].event_image,220,140) : defaultImageList,
          title: list[i].event_title,
          content: this.textOverflow(list[i].event_content,100),
          id: list[i].id,
          time: list[i].created_time,
          look: list[i].browse_num,
          apply: list[i].apply_need
        }
        arr.push(li);
      }
      this.activityList = arr;
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
    getClass(res) {
      // console.log(res)
      let list = res.data;
      let li = {},arr = [];
      for(let i = 0;i < list.length;i ++) {
        li = {
          img: list[i].classes_img ? this.$getImageUrl(list[i].classes_img,330,250) : defaultImageList,
          name: list[i].classes_title,
          id: list[i].id,
          expert: list[i].professor,
          isexpert: list[i].is_professor
        }
        arr.push(li);
      }
      this.classList = arr;
    },
    chooseExpert(index) {
      this.activeExpert = index;
    },
    changeQuestonList() {
      this.showQuestion.rotate = this.showQuestion.rotate + 360;
      if(this.showQuestion.low < 12) {
        this.showQuestion.low = this.showQuestion.low + 6;
        this.showQuestion.high = this.showQuestion.high + 6;
      }else {
        this.showQuestion.low = 0;
        this.showQuestion.high = 6;
      }
    },
    textOverflow(val,len) {
      if(!val) return '';
      val = val.toString();
      if(val.match('&nbsp;')) {
        val = val.replace(/&nbsp;/g,'')
      }
      if(val.length < len) {
        return val
      }else {
        return val.slice(0,len) + '...'
      }
    }
  },
  filters: {
    textOverflow(val,len) {
      if(!val) return '';
      val = val.toString();
      if(val.length < len) {
        return val
      }else {
        return val.slice(0,len) + '...'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.home-main {
  background-color: #fff;
  width: 100%;
  display: flex;
  justify-content: center;
  .home-content {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .home-main-banner {
    display: flex;
    justify-content: center;
    @media screen and (min-width: 1380px) {
      width: 1380px;
    }
    @media screen and (max-width: 1380px) {
      width: 1200px;
    }
    margin: 0 auto;
    .banner-content {
      width: 100%;
      padding: 30px 0 0 0;
      .banner-content-box {
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        .el-carousel {
          position: relative;
          z-index: 2;
          overflow-y: hidden;
          .el-carousel__indicators--outside {
            height: 66px;
            .el-carousel__indicator {
              padding: 25px 4px;
            }
            button {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-image: url('../assets/gunzhou_1.png');
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 100% 100%;
            }
            .el-carousel__indicator.is-active button {
              width: 14px;
              height: 14px;
              background-image: url('../assets/gunzhou_2.png');
              background-size: 120% 120%;
            }
          }
        }
        .banner-bottom {
          width: 100%;
          height: 66px;
          position: absolute;
          left: 0;
          bottom: 0;
          display: flex;
          justify-content: space-between;
          .white{
            flex-grow: 1;
            background: #f2f2f2;
          }
          .grey {
            flex-grow: 4;
            background: #eaeaea;
          }
          .yellow {
            flex-grow: 1;
            background: #fad900;
          }
        }
      }
    }
  }
  .home-main-hotclass {
    background: #fff;
    display: flex;
    justify-content: center;
    width: 100%;
    @media screen and (min-width: 1380px) {
      width: 1380px;
    }
    @media screen and (max-width: 1380px) {
      width: 1200px;
    }
    margin: 0 auto;
    .hotclass-content {
      width: 100%;
      padding: 20px 0;
      .main-content-head {
        display: flex;
        margin-bottom: 20px;
        .content-head-right {
          display: flex;
          flex-direction: column;
          margin-left: 50px;
          flex-grow: 1;
          padding: 42px 0 30px 0;
          justify-content: space-between;
          text-align: right;
          .line {
            height: 20px;
            background: #fad900;
          }
          .more {
            a span {
              font-family: 'FelixTitlingMT';
              color: #999;
              display: inline-block;
              width: 82px;
              height: 24px;
              border: 1px solid #999;
              text-align: center;
              line-height: 24px;
            }
          }
        }
      }
      .hotclass-content-head {
        display: flex;
        justify-content: space-between;
        padding-left: 40px;
        .hotclass-content-head-more {
          display: flex;
          flex-direction: column;
          justify-content: center;
          a {
            span {
              font-family: 'FelixTitlingMT';
              color: #333;
              display: inline-block;
              width: 82px;
              height: 24px;
              border: 1px solid #333;
              text-align: center;
              line-height: 24px;
            }
          }
        }
      }
      .hotclass-content-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        max-height: 681px;
        overflow: hidden;
        width: 110%;
        padding: 0 5%;
        margin-left: -5%;
        .hotclass-list-li {
          width: 330px;
          box-shadow: 0 0 5px #e6e6e6;
          margin-bottom: 20px;
          border-radius: 3px;
          overflow: hidden;
          .hotclass-list-li-img {
            height: 250px;
            overflow: hidden;
            background-color: #f2f2f2;
          }
          .hotclass-list-li-text {
            padding: 15px 20px;
            height: 80px;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            h4:nth-child(1) {
              color: #333;
              font-weight: bold;
              font-size: 16px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            h4:nth-child(2) {
              color: #666;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }
      }
    }
  }
  .line {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    .line-content {
      height: 20px;
      background: #fad900;
      transition: all 1s;
    }
  }
  .home-class-expert {
    display: flex;
    width: 100%;
    margin: 0 auto;
    padding: 20px 0;
    justify-content: space-between;
    @media screen and (min-width: 1380px) {
      width: 1380px;
    }
    @media screen and (max-width: 1380px) {
      width: 1200px;
    }
    flex-direction: column;
    .main-content-head {
      display: flex;
      margin-bottom: 20px;
      .content-head-right {
        display: flex;
        flex-direction: column;
        margin-left: 50px;
        flex-grow: 1;
        padding: 48px 0 30px 0;
        justify-content: space-between;
        text-align: right;
        .line {
          height: 20px;
          background: #fad900;
        }
        .more {
          a span {
            font-family: 'FelixTitlingMT';
            color: #999;
            display: inline-block;
            width: 82px;
            height: 24px;
            border: 1px solid #999;
            text-align: center;
            line-height: 24px;
          }
        }
      }
    }
    .home-class-expert-body {
      display: flex;
      justify-content: space-between;
    }
    .home-class-expert-left {
      @media screen and ( min-width: 1380px ) {
        width: 886px;
      }
      @media screen and ( max-width: 1380px ) {
        // width: 400px;
      }
      border-right: 1px solid #eee;
      .expert-left-head {
        padding: 0 40px;
      }
      .expert-left-mid {
        display: flex;
        width: 100%;
        @media screen and ( min-width: 1380px ) {
          .expert-left-mid-user {
            width: 500px;
          }
        }
        @media screen and ( max-width: 1380px ) {
          .expert-left-mid-user {
            width: 400px;
          }
        }
        justify-content: space-between;
        .expert-left-mid-user {
          height: 340px;
          position: relative;
          background: url('../assets/indexbg.png') no-repeat left center;
          padding: 60px 0 60px 40px;
          margin: 40px 0 20px 0;
          .message {
            h3 {
              color: #333;
              font-size: 24px;
              font-weight: bold;
            }
            p.position {
              font-size: 16px;
              color: #666;
              padding: 10px 0;
              margin: 0;
              border-bottom: 1px solid #fff;
              span {
                margin-right: 20px;
              }
            }
            p.description {
              font-size: 16px;
              color: #666;
              padding: 20px 0;
              margin: 0;
              max-width: 300px;
            }
          }
        }
        .expert-left-mid-user-profile {
          position: relative;
          @media screen and ( min-width: 1380px ) {
            margin-right: 50px;
          }
          @media screen and ( max-width: 1380px ) {
            margin-right: 15px;
          }
          .profile {
            position: absolute;
            z-index: 2;
            top: 0;
            right: 0;
          }
          .more {
            position: absolute;
            top: -40px;
            right: 0;
            a span {
              font-family: 'FelixTitlingMT';
              color: #999;
              display: inline-block;
              width: 82px;
              height: 24px;
              border: 1px solid #999;
              text-align: center;
              line-height: 24px;
            }
          }
        }
        .expert-left-mid-list {
          display: flex;
          width: 314px;
          padding-top: 274px;
          justify-content: space-around;
        }
      }
      .expert-left-foot {
        display: flex;
        justify-content: space-between;
        @media screen and ( min-width: 1380px ) {
          margin: 15px 50px 30px 0;
        }
        @media screen and ( max-width: 1380px ) {
          margin: 15px 15px 30px 0;
        }
        .list-profile {
          @media screen and ( min-width: 1380px ) {
            img {
              width: 156px;
              height: 156px;
            }
          }
          @media screen and ( max-width: 1380px ) {
            img {
              width: 140px;
              height: 140px;
            }
          }
          border: 2px solid #fff;
          cursor: pointer;
          background-color: #eee;
          display: flex;
        }
        .list-profile.active {
          border-color: #fad900;
          border-radius: 2px;
        }
      }
    }
    .home-class-expert-right {
      width: 450px;
      margin-top: -50px;
      .expert-right-head {
        display: flex;
        justify-content: space-between;
        .expert-right-head-btn {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          button {
            border: none;
            position: relative;
            padding-right: 0;
            i.el-icon-fresh {
              display: inline-block;
              height: 14px;
              width: 14px;
              background: url('../assets/Repeat.png') no-repeat center center;
              background-size: 100% 100%;
              position: absolute;
              top: 12px;
              left: 0px;
              transition: all 0.5s;
            }
          }
        }
      }
      .expert-right-list {
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        .right-list-li {
          height: 96px;
          padding: 17px 0;
          border-bottom: 1px dashed #ccc;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .list-li-left {
            h4 {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
            h4 a span {
              color: #333;
              transition: all 0.3s;
            }
            h4 a span:hover {
              color: #ff9000;
            }
          }
          .list-li-right {
            display: flex;
            justify-content: space-between;
            flex-basis: 1;
            .image {
              min-width: 50px;
              img {
                border-radius: 50%;
                border: 2px solid #fad900;
              }
            }
            .text {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              flex-grow: 1;
              line-height: 32px;
              h4{
                span {
                  padding: 0 10px;
                  border-left: 1px solid #ccc;
                }
                span:first-child {
                  padding-left: 0;
                  border: none;
                }
              }
              .look {
                display: inline-block;
                position: relative;
                background: url('../assets/View.png') no-repeat left center;
                padding-left: 20px;
              }
            }
          }
        }
      }
    }
  }
  .activities-line {
    width: 100%;
    display: flex;
    .activities-line-left {
      width: 45%;
      text-align: right;
      padding-right: 8%;
    }
    .activities-line-right {
      width: 55%;
      display: flex;
      flex-direction: column;
      padding: 20px 0;
      position: relative;
      .activities-line-content {
        height: 20px;
        background: #fad900;
        transition: all 1s;
      }
    }
  }
  .activities-main {
    @media screen and (min-width: 1380px) {
      width: 1380px;
    }
    @media screen and (max-width: 1380px) {
      width: 1200px;
    }
    margin: 0 auto 50px;
    position: relative;
    .main-content-head {
      display: flex;
      margin-bottom: 20px;
      .content-head-right {
        display: flex;
        flex-direction: column;
        margin-left: 50px;
        flex-grow: 1;
        padding: 40px 0 30px 0;
        justify-content: space-between;
        text-align: right;
        .line {
          height: 20px;
          background: #fad900;
        }
        .more {
          a span {
            font-family: 'FelixTitlingMT';
            color: #999;
            display: inline-block;
            width: 82px;
            height: 24px;
            border: 1px solid #999;
            text-align: center;
            line-height: 24px;
          }
        }
      }
    }
    .activities-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 100%;
      .activities-item {
        width: 49%;
        display: flex;
        padding: 20px 0;
        border-top: 1px solid #ccc;
        .item-image {
          height: 140px;
          width: 220px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .item-content {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          @media screen and (min-width: 1380px) {
            max-width: 436px;
          }
          @media screen and (max-width: 1380px) {
            max-width: 348px;
          }
          a {
            transition: all 0.15s;
            color: #333;
          }
          a:hover {
            color: #ff9000;
          }
          p {
            margin: 5px 0;
            font-size: 12px;
            span {
              margin-right: 20px;
            }
          }
        }
      }
      .activities-item:nth-child(1), .activities-item:nth-child(2) {
        border: none;
      }
    }
  }
}
</style>
