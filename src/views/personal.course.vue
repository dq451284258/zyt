<template>
  <div class="personalCourse">
    <div class="question-head">
      <div class="question-head-title">
        <span class="question-head-title-name">我的问题</span>
        <span class="question-title-tab">
          <el-tabs v-model="activeName"  @tab-click="handleClick">
          <el-tab-pane label="学习中" name="first">
            <ul class='study-course' v-if='showproject'>
              <li v-for='(list,index) in studycourse' :key='index' @click='tocourse(list.id)'>
                <div class='courseImg'><img :src="list.img" alt=""></div>
                <div class="courser-name" v-text='list.name'></div>
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="收藏中" name="second">
            <ul class='study-course' v-if='showproject'>
              <li v-for='(list,index) in colletcourse' :key='index' @click='tocourse(list.id)'>
                <div class='courseImg'><img :src="list.img" alt=""></div>
                <div class="courser-name" v-text='list.name'></div>
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
        </span>
      </div>
      <div class="clearboth" style='clear:both'></div>
      <div class="question-head-search">
        <el-input placeholder="请输入关键字搜索" v-model="searchinput" class="input-with-select" @keyup.enter.native='search'>
          <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
        </el-input>
      </div>
    </div>
    <div class="nodata" v-if='!showproject'>
      <img src="../assets/nomessage.png" alt="">
    </div>
    <div class="page" v-if='showproject'>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='changpagestudy'
        :current-page='currentPage'
        :page-size="pageSize"
        :total="totalpage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'personalCourse',
  data () {
    return {
      activeName:'first',
      searchinput:'',
      answerstatus:true,
      totalpage:1,
      studycourse:[],
      colletcourse:[],
      params:{
        l:10,
        p:1
      },
      currentPage:1,
      pageSize:10,
      showproject:true
    }
  },
  mounted () {
    this.getMessage();
  },
  methods:{
    getMessage() {
      this.params.user_id=localStorage.getItem('userid') || '';
      this.params.token=localStorage.getItem('token') || '';
      this.params.k='';
      this.params.t='1';
      axios.all([this.$ajax.get('/user/mycourse',{
        params: this.params
      })])
      .then(axios.spread((answerlist) => {
        this.getdata(answerlist);
        this.$NProgress.done();
      })).catch((error) => {
        console.log(error)
      })
    },
    getdata(res){
      console.log(res);
      if(res.data.result=='fail'){
        this.$confirm('您还没有登录, 是否登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            this.$router.push('/login')
          }).catch(() => {
        });
      }
      let [courselist,arr,arr_list]=[res.data.data.data,'',[]];
      this.totalpage=res.data.data.total;
      if(this.totalpage==0){
        this.showproject=false
      }else{
        this.showproject=true
      }
      for(let i = 0; i<courselist.length;i++){
        arr={
          id:courselist[i].classes_id,
          name:courselist[i].classes_title,
          img:courselist[i].classes_img?this.$getImageUrl(courselist[i].classes_img,258,159):''
        }
        arr_list.push(arr);
      }
      if(this.activeName=='first'){
        this.studycourse=arr_list;
      }else{
        this.colletcourse=arr_list;
      }
      
    },
    getsearchdata(){
      if(this.activeName=='first'){
        this.params.t=1
      }else{
        this.params.t=2
      }
      this.$ajax('/user/mycourse',{
        params: this.params
      }).then((res) => {
        this.getdata(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    search(){
      this.params.k=this.searchinput;
      this.getsearchdata();
    },
     changpagecollect(e){
      this.params.p=e;
      this.colleatcurrent=e;
      this.getsearchdata();
    },
    changpagestudy(e){
      this.params.p=e;
      this.currentPage=e;
      this.getsearchdata();
    },
    handleClick(){
      this.params.p=1;
      this.currentPage=1;
      this.getsearchdata();
    },
    tocourse(id){
      this.$router.push({ path:'/train/'+id})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.personalCourse{
    @media screen and ( max-width: 1380px ) {
        .study-course li{
            margin-right: 10px!important;
        }
    }
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
  padding: 20px 20px 0 32px;
  .page{
    margin: 20px 0;
    display: flex;
    justify-content:center;
    .el-pagination{
      display: inline-block;
    }
  }
  .nodata{
    text-align: center;
    margin-top: 100px;
    padding-bottom: 100px;
  }
  .question-head{
    position: relative;
    .question-head-title{
      display: flex;
      .question-head-title-name{
        font-size: 16px;
        font-weight: 700;
        color: #2f2e2e;
        line-height: 40px;
        margin-right: 30px;
        position: relative;
        width: 70px;
      }
      .question-head-title-name:before{
        content:'';
        width: 4px;
        height: 12px;
        background: #fed900;
        position: absolute;
        top: 14px;
        left: -32px;
      }
      .question-title-tab{
        display: inline-block;
        flex: 1;
        .el-tabs__nav-wrap::after{
          width: 0!important;
          height: 0;
        }
        .el-tabs__item.is-active{
          color: #333!important;
        }
        .el-tabs__nav-wrap::after{
          width: 0;
          height: 0;
        }
        .el-tabs__item:hover{
          color:#333!important;
        }
        .el-tabs__item{
          color: #999!important;
          font-size: 16px!important;
        }
        .study-course{
          background: #fff;
          list-style: none;
          // display: flex;
          max-width: 975px;
          // flex-wrap: wrap;
          // justify-content: space-between;
          margin-top: 30px;
          li{
            float: left;
            width: 258px;
            height: 258px;
            margin-bottom: 20px;
            border-radius: 3px;
            margin-right: 100px;
            cursor: pointer;
            .courseImg{
              width: 100%;
              height: 195px;
              background: url('../assets/defaultclass.jpg');
              border-radius: 3px 3px 0 0;
              img{
                width: 100%;
                height: 100%;
                border:1px solid #ccc;
                border-radius: 3px 3px 0 0;
              }
            }
            .courser-name{
              height: 63px;
              line-height: 18px;
              padding: 12px 8px;
              font-size: 14px;
              color: #333;
              border: 1px solid #eee;
              border-top: 0;
              margin-top: -4px;
              border-radius: 0 0 3px 3px;
            }
          }
          li:nth-of-type(3n){
            margin-right: 0;
          }
        }
      }
    }
    .question-head-search{
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
