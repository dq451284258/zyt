<template>
  <div id="activityDetails">
    <div class="details-inner" v-show='pageReady'>
        <div class="activity-details-info">
            <div class="activity-details-title">
                活动内容
            </div>
            <div class="activity-details-name" v-text='activityInfo.event_title'></div>
            <div class="activity-details-information">
                <span class="information-date" v-text='activityInfo.time'></span>
                <div>
                    <span class="information-joinnum">
                        浏览人数：{{activityInfo.browse_num}}
                    </span>
                    <span class="information-joinnum" v-if='needApply'>
                        报名人数：{{activityInfo.apply_num}}
                    </span>
                </div>
            </div>
            <div class="activity-details-comment" v-html='activityInfo.event_content'></div>
        </div>
        <div class="activity-details-other">
            <div class="dateils-other-join" v-if='needApply'>
                <div class="dateils-other-join-title">报名时间</div>
                <div class="details-other-join-name" v-if='!ifend'>剩余时间</div>
                <zk-time-down @time-end="message = '倒计时结束'" :endTime='endTime' :nowTime='nowTime' v-if='!ifend' @watchChild="parentReceive"></zk-time-down>
                <div class="activity-end details-other-join-name" v-if='ifend'>活动结束</div>
                <div class="details-other-join-button" @click='toapply(activityInfo.id)' :class="{'timeend':ifdated}" v-html='clickapply'></div>
            </div>
            <div class="details-other-recommend">
                <div class="details-other-recommend-head">
                    <span class="dateils-other-recommend-title">推荐活动</span>
                    <span class='dateils-other-recommend-title-moredata' @click='toactivitycenter'>查看更多</span>
                </div>
                <ul class="dateils-other-recommend-list">
                    <li v-for='(list,index) in recommendList' :key='index' @click='torecommendDet(list.id)'>
                        <div class="recommend-list-index" v-text='index+1'></div>
                        <div class="recommend-list-name" v-text='list.event_title' :class="{'clickstyle':list.ifclick==0?false:true}"></div>
                    </li>
                </ul>
            </div>
            <div class="details-other-banner">
                <!-- <div class="details-other-banner-img">
                    <img :src="project.event_banner" alt="">
                </div>
                <div class="details-other-banner-name" v-text='project.event_title'></div>
                <div class="details-other-banner-info">
                    <span class='details-other-banner-join' v-text='project.apply_num'></span>
                    <span class="details-other-banner-look" v-text='project.browse_num'></span>
                </div> -->
                <div class="right-banner">
                    <img src="../assets/bannermoren.jpg" alt="">
                </div>
            </div>
        </div>
        
    </div>
  </div>
</template>

<script>
import zkTimeDown from '../components/timeeime'
import axios from 'axios'
export default {
  name: 'activityDetails',
  components : {
        zkTimeDown
    },
  data () {
    return {
      activityInfo:{},//活动详情
      recommendList:[],//推荐列表
      project:{},//右下角数据
      activityId:'',//活动id
      urlhost:"",//活动详情请求url
      needApply:false,//报名人数是否显示
      endTime : '2018-07-25',//结束时间
      nowTime:'',//开始时间
      ifend:false,//是否过期
      ifdated:false,//立即报名的样式控制
      pageReady:false,
      clickapply:'点击报名'
    }
  },
  watch: {
    '$route' (to, from) {
      this.activityId=this.$route.query.id;
      this.getMessage();
    },
  },
  mounted () {
    this.activityId=this.$route.query.id;
    // this.getdata();
    // this.getrecommend();
    // this.gettoplist();
    this.getMessage();
  },
  methods:{
      parentReceive(){
          this.getMessage();
      },
      getMessage() {
      axios.all([this.$ajax('/activity/'+this.activityId),this.$ajax('/activitys/recom')]).then(axios.spread((filter, selected) => {
        this.getdata(filter);
        this.getrecommend(selected);
        this.$NProgress.done();
        this.pageReady = true;
      })).catch(axios.spread((filter, selected,all) => {
        console.log('filter:' + filter + 'selected:' + selected + 'all:' + all)
      }))
    },
    getrash(){
        this.$ajax('/activity/'+this.activityId).then((res) => {
            this.getdata(res)
        }).catch((error) => {
            console.log(error)
        })
    },
      //获取活动详情
      getdata(res) {
      const _this = this;
      let resInfo = res.data.data;
        _this.activityInfo=resInfo;
        _this.activityInfo.time=_this.formatDateTime(_this.activityInfo.created_time);
        _this.needApply=resInfo.apply_need===1?true:false;
        _this.endTime=resInfo.end_time;
        _this.nowTime=resInfo.now_time;
        for(let i = 0; i<_this.endTime.length;i++){
            _this.endTime=_this.endTime.replace('/','-')
        }
        _this.endTime=_this.endTime;
        let enddate = new Date(_this.endTime).getTime();
        // let curTime = new Date().getTime();
        let curTime = new Date(_this.nowTime).getTime();
        if(enddate-curTime<0){
            _this.ifend=true;
            _this.ifdated=true;
            this.clickapply='已结束'
        }
    },
    //报名
    toapply(id){
        if(this.ifend||this.ifdated){
                return false;
            }else{
                this.ifdated=true;
                if(this.haslogin()){
                    const _this = this;
                    let urlhost='/activity/signup';
                    let userid= localStorage.getItem("userid");
                    let token= localStorage.getItem("token");
                    _this.$ajax({
                        method: 'post',
                        url: urlhost,
                        data:{
                            "id":id,
                            "user_id":userid,
                            "token":token
                        },
                        contentType: "application/json",
                    })
                    .then((res) => {
                        _this.$NProgress.done();
                        if(res.data.result==='success'){
                            this.$alert('报名成功', '提示', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    _this.ifdated=true;
                                    _this.clickapply='已报名';
                                    // window.location.reload();
                                    _this.getrash();
                                }
                            });
                        }else{
                            if(res.data.data.errno=="-10002"){
                                this.$confirm('您还没有登录, 是否登录?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$router.push('/login')
                                }).catch(() => {

                                });
                            }else{
                                this.$alert(res.data.data.errmsg, '提示', {
                                    confirmButtonText: '确定',
                                    callback: action => {
                                        _this.ifdated=true;
                                        _this.clickapply='已报名';
                                    }
                                });
                            }
                        }
                    })
                    .catch((res) => {
                        this.ifdated=false;
                        this.$alert("falied:"+res.data.data.errmsg, '提示', {
                            confirmButtonText: '确定'
                        });
                    });
                }
            }
        
        
    },
    //获取推荐列表
    getrecommend(res) {
      const _this = this;
      let [resInfo,arr,arr_push] = [res.data.data,'',[]];
        for(let i = 0; i<resInfo.length;i++){
            arr={
                id:resInfo[i].id,
                event_title:resInfo[i].event_title,
                ifclick:0
            }
            if(arr.event_title.length>20){
                arr.event_title=arr.event_title.substring(0,20)+'...';
            }
            arr_push.push(arr);
        }
        _this.recommendList=arr_push;
    },
    //点击更多
    toactivitycenter(){
        this.$router.push({ name: 'activity'})
    },
    //推荐列表点击去详情页
    torecommendDet(id){
        this.ifclick=true;
        for( let i = 0; i<this.recommendList.length;i++){
            if(this.recommendList[i].id==id){
                this.recommendList[i].ifclick=1;
            }else{
                this.recommendList[i].ifclick=0;
            }
        }
        this.getrecommentdata(id);
    },
    //获取活动详情
      getrecommentdata(id) {
      const _this = this;
      _this.urlhost='/activity/'+id;
      _this.$ajax({
        method: 'get',
        url: _this.urlhost,
        contentType: "application/json"
      })
      .then((res) => {
        _this.$NProgress.done();
        let resInfo = res.data.data;
        _this.activityInfo=resInfo;
        _this.needApply=resInfo.apply_need===1?true:false;
        _this.activityInfo.time=_this.formatDateTime(_this.activityInfo.created_time);
        _this.endTime=resInfo.end_time;
        _this.nowtime=resInfo.now_time;
        for(let i = 0; i<_this.endTime.length;i++){
            _this.endTime=_this.endTime.replace('/','-')
        }
        let enddate = new Date(_this.endTime).getTime();
        // let curTime = new Date().getTime();
        let curTime = new Date(_this.nowtime).getTime();
        if(enddate-curTime<0){
            _this.ifend=true;
            _this.ifdated=true;
        }else{
            _this.ifend=false;
            _this.ifdated=false;
        }
      })
      .catch((res) => {
        console.log(res);
      });
    },
    haslogin() {
        if(localStorage.getItem('token')&& localStorage.getItem('userid')) {
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
    //时间转换
    formatDateTime(unix) {
        var date = new Date(unix*1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = date.getDate() <10?'0'+(date.getDate()):(date.getDate())+ ' ';
        let h = date.getHours()<10?'0'+(date.getHours()):(date.getHours())  + ':';
        let m = date.getMinutes()<10?'0'+(date.getMinutes()):(date.getMinutes()) + ':';
        let s = date.getSeconds()<10?'0'+(date.getSeconds()):date.getSeconds(); 
       return Y+M+D+' '+h+m+s;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
#activityDetails{
    @media screen and ( min-width: 1380px ) {
        .details-inner {
            width: 1380px;
        }
        .activity-details-info{
            max-width: 980px;
        }
    }
    @media screen and ( max-width: 1380px ) {
        .details-inner {
            width: 1200px;
        }
        .activity-details-info{
            max-width: 820px;
        }
    }
}
.details-inner{
    // max-width: 1380px;
    margin: 20px auto;
    display: flex;
    a{
        color:blue!important;
    }
    .activity-details-info{
        padding: 24px 75px 60px 18px;
        background: #fff;
        flex: 1;
        border-radius: 3px;
        // max-width: 980px;
        .activity-details-title{
            display: inline-block;
            font-size: 16px;
            color: #2f2e2e;
            height: 28px;
            border-bottom: 3px solid #fed900;
        }
        .activity-details-name{
            font-size: 18px;
            color: #333;
            line-height: 18px;
            margin-top: 40px;
            margin-bottom: 20px;
        }
        .activity-details-information{
            height: 52px;
            border-bottom: 1px solid #f3f3f3;
            color: #999;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            .information-joinnum{
                margin-left: 15px;
            }
        }
        .activity-details-comment{
            overflow: hidden;
            padding: 40px 40px 0;
            line-height: 20px;
            color: #666666;
            // width: 887px;
            img{
                max-width: 100%!important;
            }
        }
    }
    .activity-details-other{
        margin-left: 20px;
        max-width: 380px;
        .dateils-other-join{
            background: #fff;
            padding: 24px 15px;
            width: 382px;
            margin-bottom: 20px;
            border-radius: 3px;
            border-radius: 3px;
            .dateils-other-join-title{
                display: inline-block;
                font-size: 16px;
                color: #2f2e2e;
                height: 28px;
                border-bottom: 3px solid #fed900;
            }
            .details-other-join-name{
                width: 100%;
                text-align: center;
                color: #ff9000;
                font-weight: 700;
                font-size: 20px;
                margin-top: 35px;
            }
            .details-other-join-time{
                margin-top: 40px;
                display: flex;
                justify-content: center;
            }
            .details-other-join-button{
                width: 240px;
                height: 42px;
                background: #fed900;
                border-radius: 3px;
                text-align: center;
                line-height: 42px;
                font-size: 16px;
                color: #2f2e2e;
                margin: 0 auto;
                margin-top: 50px;
                margin-bottom: 30px;
                cursor: pointer;
            }
            .timeend{
                background: #999;
            }
        }
        .details-other-recommend{
            background: #fff;
            padding: 24px 18px;
            margin-bottom: 20px;
            border-radius: 3px;
            .details-other-recommend-head{
                display: flex;
                justify-content: space-between;
                .dateils-other-recommend-title{
                    display: inline-block;
                    font-size: 16px;
                    color: #2f2e2e;
                    height: 28px;
                    border-bottom: 3px solid #fed900;
                }
                .dateils-other-recommend-title-moredata{
                    cursor: pointer;
                }
                .dateils-other-recommend-title-moredata:hover{
                    color: #333;
                }
            }
            .dateils-other-recommend-list{
                margin-top: 20px;
                li{
                    display: flex;
                    font-size: 14px;
                    color: #2f2e2e;
                    height: 40px;
                    cursor: pointer;
                    .recommend-list-index{
                        height: 24px;
                        width: 24px;
                        border-radius: 24px;
                        background: #fed900;
                        text-align: center;
                        line-height: 24px;
                        margin-right: 12px;
                        flex-shrink:0;
                    }
                }
                .clickstyle{
                    color: #ff9000;
                }
            }
        }
        .details-other-banner{
            width: 100%;
            border-radius: 3px;
            .right-banner{
                margin-top: 20px;
                width: 100%;
                position: relative;
                margin-bottom: 20px;
                img{
                    width: 100%;
                    border-radius: 3px;
                }
            }
            .right-banner:before{
                content:'推广';
                width: 60px;
                height: 24px;
                background: #000;
                opacity: 0.6;
                text-align: center;
                line-height: 24px;
                font-size: 14PX;
                color: #fefefe;
                position: absolute;
                top: 0;
                right: 10px;
            }
            .details-other-banner-img{
                width: 100%;
                
                img{
                    width: 100%;
                    border-radius: 3px 3px 0 0;
                }
            }
            .details-other-banner-name{
                font-size: 18px;
                color: #2f2e2e;
                line-height: 54px;
                padding-left: 24px;
            }
            .details-other-banner-info{
                padding: 0 24px;
                font-size: 12px;
                color: #cccccc;
                .details-other-banner-join{
                    position: relative;
                    margin-left: 20px;
                }
                .details-other-banner-join:before{
                    content: '';
                    width: 17px;
                    height: 11px;
                    background-image: url('../assets/View.png');
                    position: absolute;
                    top: 2px;
                    left: -18px;
                }
                .details-other-banner-look{
                    position: relative;
                    margin-left:30px;
                }
                .details-other-banner-look:before{
                    content: '';
                    width: 14px;
                    height: 14px;
                    background-image: url('../assets/UserProfile.png');
                    position: absolute;
                    top: 2px;
                    left: -18px;
                }
                .details-other-banner-price{
                    float: right;
                    font-size:18px;
                    color: #ff9000;
                }
            }

        }
    }
    
}
</style>
