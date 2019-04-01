<template>
  <div class="personalTab">
    <div class="personalTab-inner">
        <div class="personalTab-item">
            <ul>
                <li  @click='totab(index)' :class="{'active':active===index}" v-for='(list,index) in tabitem' :key='index' v-if='index==surexpert?false:true'>
                    <router-link :to='list.torouter' v-text='list.title'></router-link>
                </li>
            </ul>
            <div class="problem-feedback"   @click='toback(8)'>
                <span class='backimg'><img src="../assets/wenti_icon.png" alt=""></span>
                <span class='line'></span>
                <a href='javascript:;' :class="{'active':active===8}">反馈问题</a>
            </div>
        </div>
        <div class="personalTab-main">
            <router-view></router-view>
        </div>
    </div>
    <el-dialog title="感谢您的反馈" :visible.sync="dialogFormVisible" :close-on-click-modal='false'>
      <el-form :model="forms">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="forms.name"></el-input>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="tofeedback()" :loading="loadshow" v-html='tosure'></el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'personalTab',
  data () {
    return {
      activeIndex: '',
      active:'',
      tabitem:[
          {'title':'所有动态','torouter':'/personal'},
          {'title':'项目作品','torouter':'/personal/projects'},
          {'title':'课程中心','torouter':'/personal/course'},
          {'title':'关注用户','torouter':'/personal/attention'},
          {'title':'我的问题','torouter':'/personal/myquestion'},
          {'title':'我的回答','torouter':'/personal/myanswer'},
          {'title':'我的钱包','torouter':'/personal/mywallet'}
      ],
      surexpert:100,
      dialogTableVisible: false,
      dialogFormVisible: false,
      forms: {
        name: ''
      },
      formLabelWidth: '120px',
      loadshow:false,
      tosure:'确定'
    }
  },
  mounted () {
      this.judgeRouter();
      Event.$on('judgeExpert',(res) => {
        this.judgeAnswer(res);
      })
  },
  watch:{
    $route(to,from){
        if(this.$router.history.current.path=='/personal/addproject'){
              this.active=1;
        }
        this.judgeRouter();
    }
  },
  methods:{
      judgeAnswer(data){
          if(data==0){
              this.surexpert=5;
          }
      },
      judgeRouter(){
          if(this.$router.history.current.path=='/personal'){
              this.active=0;
          }else if(this.$router.history.current.path=='/personal/projects'){
              this.active=1;
          }else if(this.$router.history.current.path=='/personal/course'){
              this.active=2;
          }else if(this.$router.history.current.path=='/personal/attention'){
              this.active=3;
          }else if(this.$router.history.current.path=='/personal/myquestion'){
              this.active=4;
          }else if(this.$router.history.current.path=='/personal/myanswer'){
              this.active=5;
          }else if(this.$router.history.current.path=='/personal/mywallet'){
              this.active=6;
          }else if(this.$router.history.current.path=='/personal/addproject'){
              this.active=1;
          }else if(this.$router.history.current.path=='/personal/mywallet/withdraw'){
              this.active=6;
          }else if(this.$router.history.current.path=='/personal/mywallet/topup'){
              this.active=6;
          }
      },
    totab(index){
        this.active=index;
    },
    toback(index){
        this.dialogFormVisible=true;
        // this.active=index;
    },
    tofeedback(){
      this.loadshow=true;
      this.tosure=`<i class="el-icon-loading"></i>加载中`;
      if(this.forms.name==''){
        this.$alert('反馈内容不能为空', '提示', {
          confirmButtonText: '确定'
        });
        this.loadshow=false;
        this.tosure='确定';
        return false;
      }
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/user/feedback',
        data:{
          "feed_content":this.forms.name,
          "user_id":userid,
          "token":token,
        },
        contentType: "application/json"
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result==='success'){
          this.$alert('反馈成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
            //   this.$router.push({ name: 'personal'})
              // location.reload();
              this.loadshow=false;
              this.tosure='确定';
              this.dialogFormVisible = false;
              this.forms.name='';
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.personalTab{
    font-size: 16px;
    color: #333;
    width: 100%;
    .personalTab-inner{
        display: flex;
        .personalTab-main{
            flex: 1;
            background: #fff;
            border-radius: 3px;
        }
        ul{
            padding: 7px 0;
            background: #fff;
            border-radius: 3px;
            margin-right: 20px;
            li{
                display: block;
                width: 200px;
                height: 50px;
                line-height: 50px;
                border-radius: 3px;
                position: relative;
                a{
                    display: block;
                    padding-left: 72px;
                    width: 200px;
                    height: 50px;
                    color: #333;
                    border-radius: 3px;
                }
                
                span{
                    display: inline-block;
                    width: 22px;
                    height: 20px;
                    position: absolute;
                    line-height: 20px;
                    left: 35px;
                    top: 12px;
                    img{
                        width: 100%;
                    }
                }
            }
            li:nth-of-type(1).active{
                background:#fed900;
                a{
                    background: url('../assets/Shape33_.png') no-repeat!important;
                    background-position: 35px 12px!important; 
                }
            }
            li:nth-of-type(2).active{
                background:#fed900;
                a{
                    background: url('../assets/Shape70_.png') no-repeat!important; 
                    background-position: 35px 12px!important; 
                }
            }
            li:nth-of-type(3).active{
                background:#fed900;
                a{
                    background: url('../assets/Shape24_.png') no-repeat!important;
                    background-position: 35px 12px!important;  
                }
            }
            li:nth-of-type(4).active{
                background:#fed900;
                a{
                    background: url('../assets/Shape3_.png') no-repeat!important;
                    background-position: 35px 12px!important;  
                }
            }
            li:nth-of-type(5).active{
                background:#fed900;
                a{
                    background: url('../assets/Shape39_.png') no-repeat!important;
                    background-position: 35px 12px!important;  
                }
            }
            li:nth-of-type(6).active{
                background:#fed900;
                a{
                    background: url('../assets/Shape60_.png') no-repeat!important;
                    background-position: 35px 12px!important;  
                }
            }
            li:nth-of-type(7).active{
                background:#fed900;
                a{
                    background: url('../assets/Shape2_.png') no-repeat!important; 
                    background-position: 35px 12px!important; 
                }
            }
            li:nth-of-type(1){
                a{
                    background: url('../assets/Shape33.png') no-repeat;
                    background-position: 35px 12px; 
                }
            }
            li:nth-of-type(2){
                a{
                    background: url('../assets/Shape70.png') no-repeat;
                    background-position: 35px 12px; 
                }
            }
            li:nth-of-type(3){
                a{
                    background: url('../assets/Shape24.png') no-repeat;
                    background-position: 35px 12px; 
                }
            }
            li:nth-of-type(4){
                a{
                    background: url('../assets/Shape3.png') no-repeat;
                    background-position: 35px 12px; 
                }
            }
            li:nth-of-type(5){
                a{
                    background: url('../assets/Shape39.png') no-repeat;
                    background-position: 35px 12px; 
                }
            }
            li:nth-of-type(6){
                a{
                    background: url('../assets/Shape60.png') no-repeat;
                    background-position: 35px 12px; 
                }
            }
            li:nth-of-type(7){
                a{
                    background: url('../assets/Shape2.png') no-repeat;
                    background-position: 35px 12px; 
                }
            }
            li:hover{
                background:#eeeeee;
            }
        }
    }
    .problem-feedback{
        position: relative;
        .line{
            height: 34px;
            width: 1px;
            background: #eee;
            margin-left: 63px;
            margin-top: 7px;
            margin-right: 20px;
        }
        a{
            display: block;
            width: 200px;
            height: 70px;
            color: #333;
            border-radius: 3px;
            padding-left: 104px;
        }
        width: 200px;
        height: 70px;
        line-height: 70px;
        background: #fff;
        // text-align: center;
        border-radius: 3px;
        margin: 20px 0;
        .active{
            background:#fed900;
        }
        span{
            display: inline-block;
            position: absolute;
            line-height: 20px;
            left: 18px;
            top: 13px;
        }
    }
    .problem-feedback:hover{
        background: #eeeeee;
    }
}
</style>
