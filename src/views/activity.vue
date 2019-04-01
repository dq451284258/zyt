<template>
  <div id="activity">
    <div class="activity-inner" v-show='pageReady'>
      <div class="activity-banner">
        <div class="activity-banner-left" @click='toactivity(toplistone.id)'>
          <img :src="toplistone.event_banner" alt="">
          <div class="activity-title" v-text='toplistone.event_title'></div>
        </div>
        <div class="activity-banner-right">
          <div class='right-list' @click='toactivity(toplisttwo.id)'  v-if='toplisttwo'>
            <img :src="toplisttwo.event_banner" alt="">
            <div class="activity-title" v-text='toplisttwo.event_title'></div>
          </div>
          <div class='right-list' @click='toactivity(toplistthree.id)' v-if='toplistthree'>
            <img :src="toplistthree.event_banner" alt="">
            <div class="activity-title" v-text='toplistthree.event_title'></div>
          </div>
        </div>
      </div>
      <div class="activity-lists">
        <ul class='activity-lists-info'>
          <li v-for="(list,index) in activityList" :key="index">
            <div class="activity-lists-info-img"><img :src="list.img" alt=""></div>
            <div class="activity-lists-info-desc">
              <div class="activity-name" v-text='list.event_title'></div>
              <div class="activity-information">
                <span class="activity-date">发布日期：{{list.endtime}}</span>
                <span class="activity-look">浏览：{{list.looknum}}</span>
                <span class="activity-join" v-if='list.apply_need==0?false:true'>报名人数：{{list.enternum}}</span>
              </div>
              <div class="activity-describe" v-html='list.desc'></div>
            </div>
            <div class="activity-lists-info-button">
              <router-link :to='{path:"/activity/details",query:{id:list.id}}' class='detailsButton'>查看详情</router-link>
            </div>
          </li>
        </ul>
      </div>
      <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='changpage'
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalpage">
      </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'activity',
  data () {
    return {
      activityList:[],
        toplistone:'',
        toplisttwo:'',
        toplistthree:'',
        totalpage:100,
        pagenum:1,
        pageReady:false,
        currentPage:1,
        pageSize:10,
        params:{
          p:1,
          l:10
        }
    }
  },
  mounted () {
    this.getMessage();
  },
  methods:{
    getMessage() {
      axios.all([this.$ajax('/activitys/banner'),this.$ajax('/activitys/list?l=10')]).then(axios.spread((filter, selected) => {
        this.gettoplist(filter);
        this.getlist(selected);
        this.$NProgress.done();
        this.pageReady = true;
      })).catch(axios.spread((filter, selected) => {
        console.log('filter:' + filter + 'selected:' + selected)
      }))
    },
    //获取置顶活动列表
    gettoplist(res) {
      const _this = this;
      let toplist = res.data.data;
      if(toplist!==''){
         if(toplist[0]){
            _this.toplistone=toplist[0];
            if(_this.toplistone.event_title.length>35){
              _this.toplistone.event_title=_this.toplistone.event_title.substring(0,35)+"...";
            }
            if(_this.toplistone.event_banner){
              _this.toplistone.event_banner=this.$getImageUrl(_this.toplistone.event_banner,832,558);
            }
         }
          if(toplist[1]){
            _this.toplisttwo=toplist[1];
            if(_this.toplisttwo.event_title.length>20){
              _this.toplisttwo.event_title=_this.toplisttwo.event_title.substring(0,20)+"...";
            }
            if(_this.toplisttwo.event_banner){
              _this.toplisttwo.event_banner=this.$getImageUrl(_this.toplisttwo.event_banner,525,270);
            }
          }
          if(toplist[2]){
            _this.toplistthree=toplist[2];
            if(_this.toplistthree.event_title.length>20){
              _this.toplistthree.event_title=_this.toplistthree.event_title.substring(0,20)+"...";
            }
            if(_this.toplistthree.event_banner){
              _this.toplistthree.event_banner=this.$getImageUrl(_this.toplistthree.event_banner,525,270);
            }
          }
      }
        
    },
    //获取普通活动列表
    getlist(res) {
      const _this = this
      let [toplist,arr,arr_list] = [res.data.data.data,'',[]];
        _this.totalpage=res.data.data.total;
        if(_this.totalpage>0){
          for(let i = 0; i<toplist.length;i++){
            arr={
              id:toplist[i].id,
              event_title:toplist[i].event_title,//活动名称
              date:toplist[i].end_time,//结束时间
              endtime:toplist[i].created_time,//发布日期
              looknum:toplist[i].browse_num,//浏览人数
              enternum:toplist[i].apply_num,//参加人数
              desc:toplist[i].event_content,//活动描述
              apply_need:toplist[i].apply_need,//是否需要报名
              img:toplist[i].event_image?this.$getImageUrl(toplist[i].event_image,220,140):''
            }
            if(arr.event_title){
              if(arr.event_title.length>35){
                arr.event_title=arr.event_title.substring(0,35)+"...";
              }
            }
            if(arr.desc){
              if(arr.desc.length>210){
                arr.desc=arr.desc.substring(0,210)+"...";
              }
            }
            arr_list.push(arr);
          }
          _this.activityList=arr_list;
        }
    },
    //更改列表请求页数
    changpage(event){
      // this.pagenum=event;
      this.params.p=event;
      this.getlistdata();
      // alert(event);
    },
    getlistdata(){
      this.$ajax('/activitys/list',{
        params: this.params
      }).then((res) => {
        this.getlist(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    //点击置顶列表去相应详情页
    toactivity(id){
      this.$router.push({ name: 'activityDetails',query:{id:id}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#activity{
  @media screen and ( min-width: 1380px ) {
    .activity-inner {
      max-width: 1380px;
    }
  }
   @media screen and ( max-width: 1380px ) {
    .activity-inner {
      max-width: 1200px;
    }
    .activity-banner-left{
      width: 724px;
      height: 485px;
    }
    .activity-banner-right{
      width: 456px;
    }
    .right-list{
      width: 456px;
      height: 235px;
    }
  }
}
.activity-inner{
  // max-width: 1380px;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
  .activity-banner{
    display: flex;
    .activity-banner-left{
      width: 832px;
      height: 558px;
      margin-right: 20px;
      position: relative;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .activity-title{
        width: 100%;
        height: 50px;
        background: rgba(0, 0, 0, 0.6);
        position: absolute;
        bottom: 0px;
        font-size: 18px;
        color: #fff;
        line-height: 50px;
        padding-left: 30px;
      }
    .activity-banner-right{
      width: 525px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .right-list{
        position: relative;
        width: 525px;
        height:270px;
      }
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
  .activity-lists{
    margin-top: 30px;
    padding: 0 38px;
    background: #fff;
    border-radius: 3px;
    .activity-lists-info{
      li:nth-last-child(1){
        border: 0px;
      }
      li{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #efefef;
        padding: 40px 0;
        .activity-lists-info-img{
          width: 220px;
          height: 140px;
          margin-right: 20px;
          flex-shrink:0;
          background: url('../assets/projectmoren.jpg');
          background-size: 100% 100%;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .activity-lists-info-desc{
          line-height: 22px;
          margin-right: 60px;
          font-size: 12px;
          color: #999;
          flex-grow:1;
          .activity-name{
            font-size: 18px;
            color: #2f2e2e;
            line-height: 18px;
            height: 38px;
          }
          .activity-information{
            height: 38px;
            line-height: 12px;
            .activity-date{
              margin-right: 28px;
            }
            .activity-look{
              margin-right: 28px;
            }
          }
          .activity-describe{
            color: #666;
          }
        }
        .activity-lists-info-button{
          display: flex;
          flex-direction: column;
          justify-content: center;
          a{
            display: inline-block;
            width: 162px;
            height: 40px;
            background: #fed900;
            border-radius: 3px;
            text-align: center;
            line-height: 40px;
            color: #2f2e2e;
            font-size: 16px;
          }
        }
      }
    }
  }
  .page{
    margin: 20px 0;
    display: flex;
    justify-content:center;
    .el-pagination{
      display: inline-block;
    }
  }
}
</style>
