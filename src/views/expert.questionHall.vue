<template>
  <div id="questionHall">
    <div class="questionHall-inner">
      <div class="questionHall-title">
        <div class="questionHall-title-name">问题大厅</div>
        <div class="questionHall-title-search">
          <el-input placeholder="请输入关键字搜索" v-model="searchinput" class="input-with-select" @keyup.enter.native='search'>
            <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
          </el-input>
        </div>
      </div>
    <div class="questionHall-main">
      <ul class='question-list' v-if='showhall'>
        <li v-for='(list,index) in questionList' :key="index">
           <div class="expert-img">
             <img :src="$imageHost+list.img" alt="">
            </div> 
           <div class="expert-info">
             <div class="question-informition">
                <span class='expert-name' v-text='list.name' @click='toexpertdetail(list.expertid)'></span>
                <span>的回答:</span>
                <span class='question-desc' v-text='list.question'></span>
             </div>
             <div class="question-describe">
               <span class='expert-skill' v-text='list.skill'></span>
               <span class='checknum' v-text='list.check'></span>
               <span class='likenum' v-text='list.like'></span>
             </div>
             <div class="question-answer">
               <div>问题描述：</div>
               {{list.answer}}
              <span class='moreanswer' v-if='list.ifmore' @click='showmore(index)'>
                <span>查看更多</span>
              </span>
             </div>
             <div class="question-price-nopay" v-if='list.ifpay' @click='todetails(list.id)'>
               <!-- ￥<span class='checkprice' v-text='list.price'></span>付费查看 -->
               <el-button type="primary">￥{{list.price}}付费查看</el-button>
             </div>
             <div class="question-price-payed" v-if='!list.ifpay' @click='todetails(list.id)'>
               已购买，去查看
             </div>
           </div>
           <div class="expert-project">
              <div class='project-img' v-for='(item,index) in list.askimg' :key = 'index'>
                <img :src="$imageHost+item.file_path" alt="">
                <img src="../assets/projectmoren.jpg" alt="" v-if='item.file_path==""?true:false'>
              </div>
              <div class='project-img' v-if='list.askimg?false:true'><img src="../assets/projectmoren.jpg" alt=""></div>
              <div class='project-more' v-if='list.ifpay'><img src="../assets/more_icon.png" alt=""></div>
              <div class='project-more' v-if='!list.ifpay'><img src="../assets/more_2.png" alt=""></div>
           </div>
        </li>
      </ul>
    </div>
    </div>
    <div class="nodata" v-if='!showhall'>
      <img src="../assets/nomessage.png" alt="">
    </div>
    <div class="page" v-if='showhall'>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='changpage'
        :total="totalpage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'questionHall',
  data () {
    return {
      searchinput:'',//搜索内容
      totalpage:1,
      ifmore:false,//是否显示查看更多
      origal:'',
      questionList:[],
      params:{
        l:10,
        p:1
      },
      showhall:true
    }
  },
  mounted () {
    this.getMessage();
  },
  methods:{
    getMessage() {
      axios.all([this.$ajax.get('/qa/list',{
        params: {
          user_id:localStorage.getItem("userid"),
          token:localStorage.getItem("token"),
          l:10
        }
      })])
      .then(axios.spread((answerlist) => {
        if(answerlist.data.result=='fail'){
          if(answerlist.data.data.errno=='-10001'){
            this.params={
              token:'',
              user_id:''
            };
            this.getlistdata();
          }
        }else{
          this.getdata(answerlist);
          this.$NProgress.done();
        }
      })).catch((error) => {
        console.log(error)
      })
    },
      search(){
        this.params.k=this.searchinput;
        this.params.user_id=localStorage.getItem("userid");
        this.params.token=localStorage.getItem("token");
        // this.params.l=10;
        // this.params.p=1;
        this.getlistdata();
      },
      changpage(event){
        // alert(event);
        this.params.user_id=localStorage.getItem("userid");
        this.params.token=localStorage.getItem("token");
        this.params.p=event;
        this.getlistdata();
      },
      //点击搜索请求数据
      getlistdata(){
        this.$ajax('/qa/list',{
          params: this.params
        }).then((res) => {
          this.getdata(res)
        }).catch((error) => {
          console.log(error)
        })
      },
      //获取数据
      getdata(res){
        let [datalist,arr,arr_list] = [res.data.data.data,'',[]];
        this.totalpage=res.data.data.total;
        if(this.totalpage==0){
          this.showhall=false
        }else{
          this.showhall=true
        }
        this.origal=datalist;
        for(let i = 0;i<datalist.length;i++){
          arr={
            id:datalist[i].id,
            img:datalist[i].answer_user_avatar,
            name:datalist[i].answer_user_name,
            question:datalist[i].ask_title,
            skill:datalist[i].skill_name,
            check:datalist[i].buy_num,
            answer:datalist[i].ask_description,
            price:datalist[i].look_answer_price,
            status:datalist[i].is_buy,
            askimg:datalist[i].ask_images,
            expertid:datalist[i].answer_user_id,
            like:datalist[i].like_num,
          }
          arr_list.push(arr);
        }
        this.questionList=arr_list;
        for(let i = 0; i<this.questionList.length;i++){
          //是否显示点击查看更多
          if(this.questionList[i].answer.length>150){
            this.questionList[i].ifmore=true;
            this.questionList[i].answer= this.questionList[i].answer.substring(0,150)+"..."
          }else{
            this.questionList[i].ifmore=false;
          }
          //是否已付款
          if(this.questionList[i].status=='0'){
            this.questionList[i].ifpay=true;
          }else{
            this.questionList[i].ifpay=false;
          }
        }
      },
      //点击查看更多
      showmore(index){
        const _this =this;
        for(let i = 0; i<_this.origal.length;i++){
          if(i===index){
            _this.questionList[i].answer= _this.origal[i].answer;
            _this.questionList[index].ifmore=false;
          }
        }
      },
      //去问题详情页
      todetails(id){
        this.$router.push({ name: 'expertAnswerDetails',query:{id:id}})
      },
      toexpertdetail(expertid){
        this.$router.push({ name: 'expertInformation',query:{id:expertid}})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">

#questionHall{
  @media screen and ( min-width: 1380px ) {
        .questionHall-inner {
            width: 1380px;
        }
    }
    @media screen and ( max-width: 1380px ) {
        .questionHall-inner {
            width: 1200px;
        }
    }
  .el-input-group__append button.el-button{
    background:#333!important;
    border-radius: 0 4px 4px 0;
    border: 0;
  }
  .el-input-group__append, .el-input-group__prepend{
    border: 1px solid #333;
    background-color: #333;
  }
  .questionHall-inner{
    border-radius: 3px;
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
    // max-width: 1380px;
    margin: 0 auto;
    padding: 20px 24px 0 24px;
    margin-top: 20px;
    background: #fff;
    .questionHall-title{
        display: flex;
        justify-content: space-between;
      .questionHall-title-name{
          font-size: 16px;
          color:#2f2e2e;
          padding-top: 10px;
          border-bottom: 3px solid #fadd1d;
      }
    }
    .questionHall-main{
      .question-list{
        display: flex;
        flex-direction:column;
        li:nth-last-child(1){
          border: 0px;
        }
        li{
          display: flex;
          padding-top: 50px;
          border-bottom: 1px solid #f1f1f1;
          .expert-img{
            flex-shrink:0;
            width: 72px;
            height: 72px;
            border-radius: 72px;
            background: url(../assets/morenmoren.jpg);
            background-size: 100% 100%;
            img{
              width: 100%;
              height: 100%;
              border-radius: 100%;
            }
          }
          .expert-info{
            max-width: 750px;
            margin-left: 20px;
            .question-informition{
              line-height: 45px;
              font-size: 14px;
              color: #333;
              .expert-name{
                color: #ff9000;
                cursor: pointer;
              }
              .question-desc{
                font-weight: 700;
              }
            }
            .question-describe{
              line-height: 22px;
              font-size: 12px;
              color: #999;
              .checknum{
                margin-left: 46px;
                position: relative;
              }
              .checknum:before{
                content: '';
                width: 17px;
                height: 11px;
                background-image: url('../assets/View.png');
                position: absolute;
                top: 2px;
                left: -18px;
              }
              .likenum{
                margin-left: 28px;
                position: relative;
              }
              .likenum:before{
                content: '';
                width: 12px;
                height: 12px;
                background-image: url('../assets/Like.png');
                position: absolute;
                top: 2px;
                left: -15px;
              }
            }
            .question-answer{
              margin-top: 20px;
              margin-bottom: 35px;
              line-height: 24px;
              font-size: 12px;
              color: #666;
              .moreanswer{
                color: #ff9000;
                cursor: pointer;
              }
            }
            .question-price-nopay{
              width: 190px;
              height: 32px;
              border-radius: 3px;
              text-align: center;
              line-height: 32px;
              color: #030408;
              font-size: 14px;
              margin-bottom: 52px;
              button{
                width: 190px;
                height: 32px;
                color: #030408;
                padding: 0;
              }
            }
            .question-price-payed{
              width: 190px;
              height: 32px;
              background: #eeeeee;
              border-radius: 3px;
              text-align: center;
              line-height: 32px;
              color: #666666;
              font-size: 14px;
              margin-bottom: 52px;
              cursor: pointer;
            }
          }
          .expert-project{
            flex: 1 1 auto;
              display: flex;
              justify-content:flex-end;
              .project-img{
                width: 212px;
                height: 136px;
                flex-shrink:1;
                position: relative;
                margin-right: 10px;
                img{
                  margin-right: 10px;
                  width: 100%;
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                }
              }
              .project-more{
                flex-shrink:1;
                width: 7px;
                position: relative;
                margin-left: 15px;
                img{
                  margin-right: 10px;
                  width: 100%;
                  position: absolute;
                  top: 54px;
                  transform: translateY(-50%);
                }
              }
          }
        }
      }
    }
  }
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
}

</style>
