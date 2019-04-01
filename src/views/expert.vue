<template>
  <div id="expert" v-show='pageReady'>
    <div class="expert-top">
      <div class="expert-top-inner">
        <div class="expert-top-banner">
          <img src="../assets/consult.jpg" alt="">
        </div>
        <div class="expert-top-search">
          <div class="search-title">专家大厅</div>
          <div class="search-input">
            <el-input placeholder="请输入关键字搜索" v-model="searchinput" class="input-with-select" @keyup.enter.native='search'>
              <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
            </el-input>
          </div>
        </div>
        <div class="expert-top-choose">
          <div class="choose-title">专业分类</div>
          <div class="choose-total" :class="{'activestyle':ifyellow===999}" @click='tochangetotal()'>全部</div>
          <div class="choose-list">
            <ul>
              <li v-for='(list,index) in domain' v-text='list.name' :class="{'activestyle':index===ifyellow}" @click='tochange(index,list.id)' :key="index"></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="expert-main">
      <div class="inner">
        <div class="expert-main-list">
          <ul class='main-list' v-if='showpage'>
            <li v-for='(list,index) in experts' :key="index" @click='toexpertInfor(list.id)'>
              <div class="experts-list-img">
                <img :src="list.img" alt="">
              </div>
              <div class="experts-list-info">
                <div class="expert-name">
                  <span v-text='list.name'></span>
                  <span class="expert-base-lavel"></span>
                </div>
                
                <div class="expert-company" v-text='list.company'></div>
                <div class="expert-information">
                  <span class='expert-skill' v-text='list.skill'></span>
                  <span class='expert-position' v-text='list.position' v-show='list.position?true:false'></span>
                </div>
                <div class="expert-quiz">
                  <a href="javascript:;"><el-button type="primary">￥{{list.price}}元提问</el-button></a>
                </div>
              </div>
              <div class="experts-list-project">
                <div class='project-img' v-for='(item,index) in list.project' :key='index'><img :src="$imageHost+item.project_img" alt=""></div>
                <div class='project-img' v-if='list.moren'></div>
                <div class='project-img' v-if='list.moren'></div>
                <div class='project-more'></div>
              </div>
            </li>
          </ul>
          <div class="nodata" v-if='!showpage'>
            <img src="../assets/nomessage.png" alt="">
          </div>
          <div class="page" v-if='showpage'>
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change='changpage'
              :total="totalpage">
            </el-pagination>
          </div>
        </div>
        <div class="expert-main-right">
          <div class="right-hot">
            <div class="hot-title">
              <div class="hot-title-name">热门问题</div>
              <div class="hot-title-more">
                <router-link to='/expert/questionhall'>查看更多</router-link>
              </div>
            </div>
            <ul class='hot-list'>
              <li v-for='(list,index) in questionList' :key="index">
                <div class="question-index" v-text='index+1'></div>
                <div class="question-info">
                  <div class="question-describe" v-text='list.question' @click='toanswerDetails(list.id)'></div>
                  <div class="question-skill" v-text='list.skill'></div>
                  <div class="question-name">
                    <span @click='todetails(list.expertid)' class='expertname'>{{list.name}} <span class='namegray'>回答</span> </span>
                    <span class="like-numb namegray rightfloat">{{list.likenum}}人</span>
                    <span class="browse-numb namegray rightfloat">{{list.browse}}人</span>
                  </div>
                  <div class="question-price"  @click='toanswerDetails(list.id)'>
                    <el-button type="primary" v-if='list.isbuy==1?false:true'>￥{{list.price}}付费查看</el-button>
                    <div class='buyed' v-if='list.isbuy==1?true:false'>已购买，去查看</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- <div class="right-banner" @click="toactivity(bannerlist.id)"> -->
          <div class="right-banner" @click="toactivity(bannerlist.id)">
            <!-- <img src="../assets/bannermoren.jpg" alt="" v-if='bannerlist.event_banner==""?true:false'> -->
            <img src="../assets/bannermoren.jpg" alt="">
            <!-- <img :src="bannerlist.event_banner" alt="" v-else> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'expert',
  data () {
    return {
      bannertop:'',
      bannerright:'',
      searchinput:'',//搜索框输入内容
      domain:'',
      ifyellow:999,
      totalpage:100,//分页总页数
      experts:[],
      questionList:[],
      pageReady:false,
      params:{
        l:10,
        p:1
      },
      showpage:false,
      bannerlist:''
    }
  },
  mounted () {
    this.getMessage();
  },
  methods:{
     getMessage() {
      axios.all([this.$ajax('/expert/skill'),this.$ajax('expert/list?l=10'),this.$ajax.get('/qa/recom',{
        params: {
          user_id:localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || '',
          l:7
        }
      })]).then(axios.spread((skill, expertlist,questionlist) => {
        this.getskilllist(skill);
        this.getexpertslist(expertlist);
        this.getquestionlist(questionlist);
        this.$NProgress.done();
        this.pageReady = true;
      })).catch(axios.spread((skill, expertlist,questionlist,bannerright) => {
        console.log('filter:' + skill + 'selected:' + expertlist+'questionlist:'+questionlist)
      }))
    },
    //获取专业列表
    getskilllist(res){
      
      let datalist = res.data.data;
      this.domain=datalist
    },
    //获取专家列表
    getexpertslist(res){
      let [datalist,arr,arr_list] = [res.data.data.data,'',[]];
      this.totalpage=res.data.data.total;
      if(this.totalpage<=0){
        this.showpage=false;
      }else{
        this.showpage=true;
      }
      for(let i = 0; i<datalist.length;i++){
        arr={
          'id':datalist[i].user_id,//专家id
          'img':datalist[i].avatar?this.$imageHost+datalist[i].avatar:'',//专家头像
          'name':datalist[i].name,//专家名字
          'company':datalist[i].company,//专家所在公司名称
          'skill':datalist[i].skill_name,//专家专业
          'position':datalist[i].company_position,//公司职位
          'price':datalist[i].ask_price,//提问价格
          'isopenask':datalist[i].is_open_ask,//是否开放提问
          'project':datalist[i].project//专家项目
        }
        arr_list.push(arr);
        if(datalist[i].project.length>0){
          arr_list[i].moren=false;
        }else{
          arr_list[i].moren=true;
        }
      }
      this.experts=arr_list;
    },
    //获取问答列表
    getquestionlist(res){
      let [questionlist,arr,arr_list]=[res.data.data,'',[]];
      for(let i = 0; i<questionlist.length;i++){
        arr={
          id:questionlist[i].id,
          question:questionlist[i].ask_title,//问题名称
          skill:questionlist[i].skill_name,
          name:questionlist[i].answer_user_name,
          price:questionlist[i].look_price,
          browse:questionlist[i].buy_num,
          expertid:questionlist[i].answer_user_id,
          isbuy:questionlist[i].is_buy,
          likenum:questionlist[i].like_num,
        }
        if(arr.question.length>52){
          arr.question=arr.question.substring(0,52)+"...";
        }
        arr_list.push(arr);
      }

      this.questionList=arr_list;
    },
    //点击专业分类
    tochange(index,item){
      this.ifyellow=index;
      // alert(item);
      this.params.f=item;
      this.togetdata();
    },
    //点击全部
    tochangetotal(){
      this.ifyellow=999;
      this.params.f=null;
      this.togetdata();
    },
    //搜索
    search(){
      this.params.k=this.searchinput;
      this.params.f='';
      this.ifyellow=999;
      this.togetdata();
    },
    //去获取筛选列表数据
    togetdata(){
      this.$ajax('expert/list',{
        params: this.params
      }).then((res) => {
        this.getexpertslist(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    //分页
    changpage(event){
      this.params.p=event;
      this.togetdata();
    },
    //获取右侧底部广告位
    getbanner(res){
      this.bannerlist=res.data.data[0];
    },
    //去专家详情
    toexpertInfor(id){
      this.$router.push({ name: 'expertInformation',query:{id:id}})
    },
    //去问题详情
    toanswerDetails(id){
      this.$router.push({ name: 'expertAnswerDetails',query:{id:id}})
    },
    toactivity(id){
      // this.$router.push({ name: 'activityDetails',query:{id:id}})
    },
    todetails(expertid){
      this.$router.push({ name: 'expertInformation',query:{id:expertid}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

#expert{
  .el-input-group__append{
    border: 1px solid #333!important;
    color: #fff;
    background-color: #333;
  }
  .el-input-group__append button.el-button{
    background:#333!important;
    border-radius: 0 4px 4px 0;
    border: 0;
    width: 70px;
  }
  .el-input-group--append .el-input__inner{
    width: 410px;
    background: #f3f3f3;
    border: 0;
  }
  @media screen and ( min-width: 1380px ) {
    .expert-top-inner {
      max-width: 1380px;
    }
  }
   @media screen and ( max-width: 1380px ) {
    .expert-top-inner {
      max-width: 1200px;
    }
    .inner{
      width: 1200px;
    }
    .expert-main-list{
      width: 850px;
    }
  }
}
.expert-top{
  background: #fff;
  .expert-top-inner{
    max-width: 1380px;
    margin: 0 auto;
    .expert-top-banner{
      padding-top: 21px;
      width: 100%;
      img{
        width: 100%;
      }
    }
    .expert-top-search{
      height: 82px;
      border-bottom: 1px solid #dbdbdb;
      display: flex;
      align-items:center;
      justify-content:space-between;
      .search-title{
        font-size: 18px;
        color: #333;
        font-weight: 700;
      }
    }
    .expert-top-choose{
      display: flex;
      .activestyle{
        color: #ff9000!important;
        font-weight: 700!important;
      }
      .choose-title{
        font-size: 14px;
        color: #333;
        font-weight: 700;
        margin-right: 30px;
        line-height: 60px;
        width: 86px;
      }
      .choose-total{
        font-size: 14px;
        color: #999;
        line-height: 60px;
        width: 58px;
        cursor: pointer;
      }
      .choose-list{
        padding-bottom: 20px;
        position: relative;
        ul{
          display: flex;
          flex-wrap: wrap;
          max-width: 1243px;
          li{
            font-size: 14px;
            color: #999;
            padding: 0 30px;
            line-height: 60px;
            cursor: pointer;
          }
        }
      }
      .choose-list:before{
          content:'';
          width: 100%;
          border: 0.5px dashed #dbdbdb;
          position: absolute;
          top: 60px;
        }
    }
  }
}
.expert-main{
  margin-top: 20px;
  .inner{
    max-width: 1380px;
    margin: 0 auto;
    display: flex;
    .expert-main-list{
      flex: 1;
      flex-shrink:1;
      .nodata{
        text-align: center;
        margin-top: 100px;
      }
      .main-list{
        background: #fff;
        border-radius: 3px;
        li:nth-last-child(1){
          border: 0px;
        }
        li{
          display: flex;
          padding: 28px 25px 28px 0;
          border-bottom: 1px solid #f4f4f4;
          font-size: 12px;
          color: #999;
          .expert-base-lavel{
            margin-right: 28px;
            position: relative;
            color: #212121;
          }
          .expert-base-lavel:before{
              content: '';
              width: 9px;
              height: 9px;
              border-radius: 9px;
              background: url('../assets/fffff_03.png');
              position: absolute;
              top: -3px;
              right: -15px;
          }
          .experts-list-img{
            width: 75px;
            height: 75px;
            border-radius: 75px;
            margin:0 20px;
            background: url(../assets/morenmoren.jpg);
            background-size: 100% 100%;
            img{
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
          }
          .expert-name{
            font-size: 16px;
            color: #030408;
            line-height: 44px;
          }
          .expert-company{
            height: 22px;
          }
          .expert-information{
            height: 22px;
            .expert-skill{
              padding-right: 10px;
            }
            .expert-position{
              padding-left: 20px;
              border-left: 1px solid #d2d2d2;
            }
          }
          .expert-quiz{
            a{
              display: inline-block;
              height: 33px;
              margin-top: 15px;
              width: 196px;
              border-radius: 4px;
              font-size: 14px;
              text-align: center;
              button{
                height: 33px;
                width: 196px;
                line-height: 33px;
                padding: 0!important;
                color: #030408;
              }
            }
          }
          .experts-list-project{
            flex: 1 1 auto;
            display: flex;
            justify-content:flex-end;
            .project-img{
              width: 212px;
              height: 136px;
              flex-shrink:1;
              margin-right: 10px;
              background: url('../assets/projectmoren.jpg');
              background-size: 100% 100%;
              img{
                margin-right: 10px;
                width: 100%;
                height: 100%;
              }
            }
            .project-more{
              flex-shrink:1;
              width: 7px;
              height: 25px;
              margin-top: 54px;
              position: relative;
              margin-left: 15px;
              background: url("../assets/more_icon.png") no-repeat;
            }
            .project-more:hover{
              cursor: pointer;
              background: url("../assets/more_2.png") no-repeat;
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
    .expert-main-right{
      flex-shrink:1;
      width: 330px;
      margin-left: 20px;
      .right-hot{
        padding: 20px;
        background: #fff;
        border-radius: 3px;
        .hot-title{
          display: flex;
          justify-content:space-between;
          .hot-title-name{
            font-size: 16px;
            color: #2f2e2e;
            border-bottom: 3px solid #fadd1d;
            padding-bottom: 8px;
          }
          .hot-title-more{
            a{
              font-size: 14px;
              color: #999;
              cursor: pointer;
            }
            a:hover{
              color: #333;
            }
          }
        }
        .hot-list{
          li:nth-of-type(1){
            border-top: 0;
            .question-index{
              background:#fed900;
            }
          }
          li:nth-of-type(2){
            .question-index{
              background:#fed900;
            }
          }
          li:nth-of-type(3){
            .question-index{
              background:#fed900;
            }
          }
          li{
            display: flex;
            padding-top: 20px;
            padding-bottom: 20px;
            border-top: 1px solid #f4f4f4;
            .question-index{
              flex-shrink: 0;
              font-size: 14px;
              color: #2f2e2e;
              width: 18px;
              height: 18px;
              border-radius: 18px;
              background: #eee;
              line-height: 18PX;
              text-align: center;
            }
            .question-info{
              margin-left: 15px;
              font-size: 12px;
              width: 100%;
              .question-describe{
                font-size: 14px;
                color: #2f2e2e;
                line-height: 24px;
                cursor: pointer;
              }
              .question-skill{
                color: #999;
                height: 20px;
              }
              .question-name{
                color: #ff9000;
                height: 22px;
                width: 100%;
                .expertname{
                  cursor: pointer;
                }
                .rightfloat{
                  float: right;
                }
                .namegray{
                  color: #2f2e2e;
                }
                .browse-numb{
                  padding-right: 8px;
                  position: relative;
                  margin-right: 20px;
                }
                .browse-numb:before{
                  content: '';
                  width: 17px;
                  height: 11px;
                  background: url('../assets/View.png');
                  position: absolute;
                  top: 2px;
                  left: -20px;
                }
                .like-numb{
                  position: relative;
                }
                .like-numb:before{
                  content: '';
                  width: 12px;
                  height: 12px;
                  background: url('../assets/Like.png');
                  position: absolute;
                  top: 2px;
                  left: -18px;
                }
              }
              .question-price{
                color: #2f2e2e;
                width: 160px;
                height: 22px;
                border-radius: 3px;
                text-align: center;
                line-height: 22px;
                margin-top: 12px;
                cursor: pointer;
                button{
                  width: 160px;
                  height: 22px;
                  padding: 0;
                  color: #2f2e2e;
                }
                .buyed{
                  color: #2f2e2e;
                  width: 160px;
                  height: 22px;
                  border-radius: 3px;
                  text-align: center;
                  line-height: 22px;
                  margin-top: 12px;
                  background: #eee;
                }
              }
            }
          }
        }
      }
      .right-banner{
        margin-top: 20px;
        width: 100%;
        position: relative;
        margin-bottom: 20px;
        border-radius: 3px;
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
    }
  }
}
</style>
