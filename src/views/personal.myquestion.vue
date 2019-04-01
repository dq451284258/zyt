<template>
  <div class="personalQuestion">
    <div class="question-head">
      <div class="question-head-title">
        <span class="question-head-title-name">我的问题</span>
        <span class="question-title-tab">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我问的" name="first">
              <ul class='my-ask' v-if='showquestion'>
                <li v-for='(list,index) in datalist' :key='index'>
                  <div class="ask-main">
                    <div class="ask-name">向<span @click='toexpertdetails(list.answerUserid)'>{{list.name}}</span>提问了问题</div>
                    <div class="ask-title" v-text='list.title' @click='toquestiondetail(list.id)'></div>
                    <div class="ask-desc">
                      <div class="ask-desc-title">问题描述：</div>
                      <div class="ask-desc-main" v-text='list.desc'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.askimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="ask-answer" v-if='list.status==5?true:false'>
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                      <a href="javascript:;" @click="openappeal(list.id)" class='ask-answer-appeal ask-answer-appeal-button'>对回答不满意，进行申诉</a>
                    </div>
                    <div class="ask-answer" v-if='list.status==1?true:false'>
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="ask-answer" v-if='list.status==3?true:false'>
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                      <div class="ask-answer-appeal">已退款</div>
                    </div>
                    <div class="ask-answer" v-if='list.status==2?true:false'>
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                      <div class="ask-answer-appeal">对回答不满意，申诉中</div>
                    </div>
                    <div class="ask-answer" v-if='list.status==6?true:false'>
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                      <div class="ask-answer-appeal">申诉退款中</div>
                    </div>
                    <div class="ask-answer" v-if='list.status==0?true:false'>
                      <div class="ask-answer-status">待回答</div>
                    </div>
                  </div>
                  <div class="ask-date" v-text='list.date'></div>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="购买的" name="second">
              <ul class='my-ask' v-if='showquestion'>
                <li v-for='(list,index) in datalist' :key='index'>
                  <div class="ask-main">
                    <div class="ask-title" v-text='list.title' @click='toquestiondetail(list.id)'></div>
                    <div class="ask-desc">
                      <div class="ask-desc-title">问题描述：</div>
                      <div class="ask-desc-main" v-text='list.desc'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.askimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="ask-answer">
                      <div class="ask-answer-title" @click='toexpertdetails(list.answerUserid)'>{{list.name}}的回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="ask-date" v-text='list.date'></div>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="关闭的" name="third">
              <ul class='my-ask' v-if='showquestion'>
                <li v-for='(list,index) in datalist' :key='index'>
                  <div class="ask-main">
                    <div class="ask-name">向<span @click='toexpertdetails(list.answerUserid)'>{{list.name}}</span>提问了问题</div>
                    <div class="ask-title" v-text='list.title' @click='toquestiondetail(list.id)'></div>
                    <div class="ask-desc">
                      <div class="ask-desc-title">问题描述：</div>
                      <div class="ask-desc-main" v-text='list.desc'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.askimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="ask-answer" v-if='list.status==1?true:false'>
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="ask-answer" v-if='list.status==4?true:false'>
                      <div class="ask-answer-status">已过期</div>
                    </div>
                    <div class="ask-answer" v-if='list.status==3?true:false'>
                      <div class="ask-answer-status">已退款</div>
                    </div>
                  </div>
                  <div class="ask-date" v-text='list.date'></div>
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
    <div class="nodata" v-if='!showquestion'>
      <img src="../assets/nomessage.png" alt="">
    </div>
    <div class="page" v-if='showquestion'>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='changpage'
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalpage">
      </el-pagination>

      <!-- Form -->
      <el-dialog title="申诉说明" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.name"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="toAppeal">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'personalQuestion',
  data () {
    return {
      activeName:'first',
      searchinput:'',
      datalist:[],
      answerstatus:true,
      totalpage:1,
      currentPage:1,
      pageSize:10,
      params:{
        l:10,
        p:1
      },
      appealdesc:'',//申诉内容
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: ''
      },
      formLabelWidth: '120px',
      appealid:'',//申诉问题id
      showquestion:true
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
      this.params.t='ask';
      axios.all([this.$ajax.get('/user/myquestion',{
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
      let [questionlist,arr,arr_list]=[res.data.data.data,'',[]];
      this.totalpage=res.data.data.total;
      if(this.totalpage==0){
        this.showquestion=false
      }else{
        this.showquestion=true
      }
      for(let i = 0; i<questionlist.length;i++){
        arr={
          id:questionlist[i].id,
          name:questionlist[i].answer_user_name?questionlist[i].answer_user_name:'昵称',
          title:questionlist[i].ask_title,
          desc:questionlist[i].ask_description,
          answer:questionlist[i].answer_content,
          status:questionlist[i].ask_status,
          date:questionlist[i].create_time,
          askimg:questionlist[i].ask_images,
          answerimg:questionlist[i].answer_images,
          answerUserid:questionlist[i].answer_user_id
        }
        arr_list.push(arr);
      }
      this.datalist=arr_list;
    },
    handleClick(){
      this.currentPage=1;
      this.params.p=1;
      this.getsearchdata();
    },
    getsearchdata(){
      if(this.activeName=='first'){
        this.params.t='ask'
      }else if(this.activeName=='second'){
        this.params.t='buy'
      }else{
        this.params.t='close'
      }
      this.$ajax('/user/myquestion',{
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
    changpage(e){
      this.params.p=e;
      this.currentPage=e;
      this.getsearchdata();
    },
    //去申诉
    toAppeal(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/user/myquesionappeal',
        data:{
          "qid":this.appealid,
          "user_id":userid,
          "token":token,
          "appeal_content":this.form.name,
        },
        contentType: "application/json"
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result==='success'){
          this.$alert('申诉成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              // this.$router.push({ name: 'personalMyanswer'})
              // location.reload();
              this.dialogFormVisible = false;
              this.getMessage();
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
              }
            });
          }
        }
      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
    openappeal(id) {
      this.dialogFormVisible = true;
      this.appealid=id;
    },
    toexpertdetails(id){
      this.$router.push({ name: 'expertInformation',query:{id:id}})
    },
    toquestiondetail(questionid){
      this.$router.push({ name: 'expertAnswerDetails',query:{id:questionid}})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>

.personalQuestion{
  .el-textarea__inner{
    min-height: 145px!important;
    background: #f4f4f4!important;
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
  .nodata{
    text-align: center;
    margin-top: 100px;
    padding-bottom: 100px;
  }
  .page{
    margin: 20px 0;
    display: flex;
    justify-content:center;
    .el-pagination{
      display: inline-block;
    }
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
        .el-tabs__content{
          margin-left: -96px;
        }
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
        .my-ask{
          background: #fff;
          li{
            display: flex;
            padding: 28px 0;
            border-bottom: 1px solid #f4f4f4;
            font-size: 14px;
            color: #333333;
            .ask-main{
              flex: 1;
            }
            .ask-date{
              width: 168px;
              text-align: center;
              color: #999;
              font-size: 14px;
            }
            .ask-name{
              height: 20px;
              span{
                color: #ff9000;
                cursor: pointer;
              }
            }
            .ask-title{
              font-weight: 700;
              // height: 34px;
              margin-bottom: 15px;
              margin-top: 5px;
              cursor: pointer;
            }
            .ask-desc{
              padding-bottom: 12px;
              .descImg{
                display: flex;
                li{
                  width: 212px;
                  height: 136px;
                  padding: 0;
                  margin-right: 10px;
                  border: 0;
                  img{
                    width: 100%;
                  }
                }
              }
              .ask-desc-title{
                color: #ff9000;
                height: 20px;
              }
              .ask-desc-main{
                color: #666;
                line-height: 23px;
                margin-bottom: 15px;
              }
            }
            .ask-answer{
              .descImg{
                display: flex;
                li{
                  width: 212px;
                  height: 136px;
                  padding: 0;
                  margin-right: 10px;
                  border: 0;
                  img{
                    width: 100%;
                  }
                }
              }
              .ask-answer-title{
                color: #ff9000;
                height: 20px;
                cursor: pointer;
              }
              .ask-answer-main{
                color: #666;
                line-height: 23px;
                margin-bottom: 34px;
              }
              .ask-answer-appeal{
                color: #999;
                text-align: right;
              }
              .ask-answer-appeal-button{
                text-decoration:underline;
                float: right;
              }
              .ask-answer-appeal-button:hover{
                color: #333;
              }
              .ask-answer-status{
                width: 110px;
                height: 30px;
                line-height: 30px;
                color: #333;
                background: #eee;
                font-size: 14px;
                text-align: center;
              }
            }
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
