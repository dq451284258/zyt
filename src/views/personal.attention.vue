<template>
  <div class="personalAttention">
    <div class="expert-projects-head">
      <div class="expert-projects-title">我关注的人</div>
      <div class="search-input">
        <el-input placeholder="请输入关键字搜索" v-model="searchinput" class="input-with-select" @keyup.enter.native='search'>
          <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
        </el-input>
      </div>
    </div>
    <ul class='attentionList' v-if='showattented'>
      <li v-for='(list,index) in attentionlist' :key='index'>
        <div class="user-img" @click='toexpertdetails(list.id)'>
          <img src="../assets/defaultuser.jpg" alt="" v-show='list.img?false:true'>
          <img :src="$imageHost+list.img" alt="">
        </div>
        <div class="user-info" @click='toexpertdetails(list.id)'>
          <div class="user-info-name">
            <span class="name" v-text='list.name'></span>
            <span class="leval" v-text='list.leval'></span>
          </div>
          <div class="user-info-desc" v-text='list.desc'></div>
          <div class="user-info-skill" v-text='list.skill'></div>
          <div class="user-info-conpany">
            <span class="company-name" :class='{"company-name-border":list.ifborder}' v-text='list.company'></span>
            <span class="company-position" v-text='list.position'></span>
          </div>
        </div>
        <div class="user-status" @click='cancel(list.id,index)' :class='{"changestatus":list.status}' v-text='list.attented'>已关注</div>
      </li>
    </ul>
    <div class="nodata" v-if='!showattented'>
      <img src="../assets/nomessage.png" alt="">
    </div>
    <div class="page" v-if='showattented'>
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
  name: 'personalAttention',
  data () {
    return {
      searchinput:'',
      attentionlist:[],
      totalpage:1,
      params:{
        l:10,
        p:1
      },
      changestatus:-1,
      canclestyle:false,
      attented:false,
      showattented:true
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
      axios.all([this.$ajax.get('/user/myfollow',{
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
      let [courselist,arr,arr_list]=[res.data.data.data,'',[]];
      this.totalpage=res.data.data.total;
      if(this.totalpage==0){
        this.showattented=false;
      }else{
        this.showattented=true;
      }
      for(let i = 0; i<courselist.length;i++){
        arr={
          id:courselist[i].attention_user_id,
          img:courselist[i].avatar,
          skill:courselist[i].skill_name,
          name:courselist[i].name,
          desc:courselist[i].description,
          company:courselist[i].company,
          position:courselist[i].company_position,
          leval:'',
          status:false,
          attented:'已关注',
          ifborder:courselist[i].company_position==''||courselist[i].company==''?false:true
        }
        if(arr.desc.length>105){
          arr.desc=arr.desc.substring(0,104)+"...";
        }
        arr_list.push(arr);
      }
      this.attentionlist=arr_list;
    },
    search(){
      this.params.k=this.searchinput;
      this.getchangedata();
    },
    changpage(e){
      this.params.p=e;
      this.getchangedata();
    },
    getchangedata(){
      this.$ajax('/user/myfollow',{
        params: this.params
      }).then((res) => {
        this.getdata(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    tosure(id,index){
      this.$confirm('确定取消关注?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
          this.cancel(id,index);
        }).catch(() => {
      });
    },
    cancel(id,index){
      let userid= localStorage.getItem("userid");
            let token= localStorage.getItem("token");
            this.$ajax({
                method: 'post',
                url: '/user/follow',
                data:{
                "follow_user_id":id,
                "user_id":userid,
                "token":token,
                "t":'cancel'
                },
                contentType: "application/json"
            })
            .then((res) => {
                this.$NProgress.done();
                if(res.data.result==='success'){
                    this.$alert('已取消关注', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          for(let i = 0;i<this.attentionlist.length;i++){
                            this.attentionlist[index].status=true;
                            this.attentionlist[index].attented='关注'
                          }
                        }
                    });
                }else{
                  if(res.data.data.errno=='-50010'){
                    this.add(id,index);
                  }else{
                    this.$alert(res.data.data.errmsg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if(res.data.data.errno=="-10002"){
                                this.$router.push('/login')
                            }
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
    toexpertdetails(id){
      this.$router.push({ name: 'expertInformation',query:{id:id}})
    },
    add(id,index){
      let userid= localStorage.getItem("userid");
            let token= localStorage.getItem("token");
            this.$ajax({
                method: 'post',
                url: '/user/follow',
                data:{
                "follow_user_id":id,
                "user_id":userid,
                "token":token,
                "t":'add'
                },
                contentType: "application/json"
            })
            .then((res) => {
                this.$NProgress.done();
                if(res.data.result==='success'){
                    this.$alert('已关注成功', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                          for(let i = 0;i<this.attentionlist.length;i++){
                            this.attentionlist[index].status=false;
                            this.attentionlist[index].attented='已关注'
                          }
                        }
                    });
                }else{
                    this.$alert(res.data.data.errmsg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if(res.data.data.errno=="-10002"){
                                this.$router.push('/login')
                            }
                        }
                    });
                }
            })
            .catch((res) => {
                this.$alert(res.data.data.errmsg, '提示', {
                confirmButtonText: '确定'
                });
            });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
.personalAttention{
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
  padding: 0 20px 0 32px;
  .expert-projects-head{
    display: flex;
    margin-top: 20px;
    padding-bottom: 18px;
    margin-bottom: 10px;
    .expert-projects-title{
      flex: 1;
      font-size: 16px;
      font-weight: 700;
      color: #2f2e2e;
      line-height: 40px;
      position: relative;
    }
    .expert-projects-title:before{
      content: '';
      width: 4px;
      height: 12px;
      background: #fed900;
      position: absolute;
      top: 14px;
      left: -32px;
    }
  }
  .attentionList{
    list-style: none;
    li{
      display: flex;
      padding: 30px 0px;
      
      .user-img{
        width: 80px;
        height: 80px;
        margin-right: 20px;
        img{
          width: 100%;
          border-radius: 80px;
        }
      }
      .user-info{
        flex: 1;
        .user-info-name{
          font-size: 16px;
          color: #2f2e2e;
          line-height: 30px;
          .name{
            position: relative;
          }
          .name:before{
              content: '';
              width: 9px;
              height: 9px;
              border-radius: 9px;
              background: url('../assets/fffff_03.png');
              position: absolute;
              top: 0px;
              right: -12px;
          }
        }
        .user-info-desc{
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
        .user-info-skill{
          font-size: 14px;
          color: #999;
          height: 24px;
        }
        .user-info-conpany{
          font-size: 14px;
          color: #999;
          height: 24px;
          .company-name{
            padding-right: 10px;
            margin-right: 10px;
          }
          .company-name-border{
            border-right: 2px solid #eaeaea;
          }
        }
      }
      .user-status{
        width: 99px;
        height: 34px;
        border: 1px solid #cccccc;
        line-height: 34px;
        text-align: center;
        border-radius: 3px;
        font-size: 14px;
        color: #666;
        margin: 35px 80px 0 105px;
        cursor: pointer;
      }
      .changestatus{
        background: #fed900;
        border: 1px solid #fed900;
        color: #333;
      }
    }
  }
}
</style>
