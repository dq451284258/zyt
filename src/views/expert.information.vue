<template>
  <div id="expertInformation" v-if='totalshow'>
    <div class="expertInformation-inner" v-show='!nodata'>
        <div class="expertInformation-desc">
            <div class="expert-quizInfo">
                <div class="quiz-expert-img">
                    <img src="../assets/morenmoren.jpg" alt="" v-if='expertinfo.avatar==""?true:false'>
                    <img :src="$imageHost+expertinfo.avatar" alt="" v-if='expertinfo.avatar==""?false:true'>
                    <div class="attention-expert"><el-button type="primary" @click='toattention' :loading="loadshow" v-html='toadd'></el-button></div>
                </div>
                <div class="quiz-expert-information">
                    <div class="expert-base">
                        <span class='expert-base-name' v-text='expertinfo.name'></span>
                        <span class="expert-base-lavel"  v-show='expertinfo.professor_status>0?true:false'></span>
                    </div>
                    <div class="expert-dsec" v-text='expertinfo.description'></div>
                    <div class="expert-skill">
                        <span class='expert-skill-work centerline' v-text='expertinfo.skill_name'  v-show='expertinfo.skill_name?true:false'></span>
                        <span class='expert-skill-workposition centerline-last' v-show='expertinfo.expertise?true:false'>
                            <span class='skill-list' v-for='(skillitem,index) in expertinfo.expertise' :key='index' v-text='skillitem'></span>
                        </span>
                    </div>
                    <div class="expert-company">
                        <span class="expert-desc-company centerline" v-text='expertinfo.company'  v-show='expertinfo.company?true:false'></span>
                        <span class="expert-desc-position centerline-last" v-text='expertinfo.company_position'  v-show='expertinfo.company_position?true:false'></span>
                    </div>
                    <div class="expert-company">
                        <div class="expert-social-work" v-for='(lists,index) in expertinfo.social_position' :key='index'>
                            <span class="social" v-text='lists[0]'></span>
                            <span class="socialwork" v-text='lists[1]'></span>
                        </div>
                    </div>
                </div>
                <div class="quiz-expert-price" v-show='showask'>
                    <a href="javascript:;" @click='askqueation'><el-button type="primary">￥{{expertinfo.ask_price}}提问</el-button></a>
                    <div class="show-code" v-show="expertinfo.ecard_show === 1">
                      <qriously :value="qrcode.value" :size="qrcode.size" :backgroundAlpha="qrcode.backgroundAlpha"/>
                      <p><span>名片二维码</span></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="expertInformation-main">
            <el-tabs v-model="activeName"  @tab-click="handleClick">
                <el-tab-pane label="所有动态" name="first">
                    <ul class='expert-dynamic' v-if='showdynamic'>
                        <li v-for='(list,index) in expertDynamicList' :key='index'>
                            <div class="expert-dynamic-answer classify-list">
                                <div class="expert-dynamic-img">
                                    <div class="expert-dynamic-date" v-text='list.create_time'></div>
                                </div>
                                <div class="expert-dynamic-info">
                                     <div class="expert-dynamic-info-sort" v-text='list.title'></div>
                                    <div class="expert-dynamic-info-courename">
                                        <a :href="list.url" v-text='list.subtitle'></a>
                                    </div>
                                    <div class="expert-dynamic-info-desc">
                                        <span v-if='list.content'>问题描述：</span>
                                        <span v-text='list.content'></span>
                                        <a :href="list.url" class='checkdetails' v-if='list.ifshow'>查看详情</a>
                                    </div>
                                </div>
                                <div class="expert-dynamic-picture">
                                    <div class='project-img' v-for='(item,index) in list.images' :key='index'><img :src="item" alt=""></div>
                                    <div class='project-more-moren' v-if='list.images==""?true:false'><img src="../assets/projectmoren.jpg" alt=""></div>
                                    <div class='project-more'></div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </el-tab-pane>
                <el-tab-pane label="项目作品" name="second">
                    <ul class='expert-projects'>
                        <li v-for='(list,index) in expertProjectList' :key='index'>
                            <div class="project-info">
                                <div class="project-info-name" v-text='list.name'></div>
                                <div class="project-info-desc" v-if='!list.projectshow'>
                                    项目描述：{{list.desctotal}}
                                </div>
                                <div class="project-info-desc" v-if='list.projectshow'>
                                    项目描述：{{list.desc}}
                                    <a class='checkdetails' v-if='list.projectshow' @click='projectdetails(list.id)' v-text='list.upordown'></a>
                                </div>
                            </div>
                            <div class="projrct-picture">
                                <div class='project-img'><img :src="$imageHost+list.img" alt=""></div>
                                <div class='project-img' v-if='list.img==""?true:false'><img src="../assets/projectmoren.jpg" alt=""></div>
                                <div class='project-more'></div>
                            </div>
                        </li>
                    </ul>
                </el-tab-pane>
            </el-tabs>
            <div class="nodata" v-if='!showdynamic'>
                <img src="../assets/nomessage.png" alt="">
            </div>
        </div>
        <div class="page" v-if='showdynamic'>
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change='changpageProject'
                :current-page='currentPage'
                :page-size="pageSize"
                :total="totalpageProject">
            </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'expertInformation',
  data () {
    return {
       expertinfo:{},
      activeName: 'first',
      expertDynamicList:[],//专家动态列表
      expertProjectList:[],//专家项目列表
      totalpageProject:1,//项目总页数
      currentPage:1,
      pageSize:10,
      projectParams:{
          l:10,
          p:1
      },
      params:{
        l:10,
        p:1
      },
      nodata:false,
      showdynamic:true,
      toadd:'',
      totalshow:false,
      showask:false,
      status:'',
      loadshow:false,
      hosturl:'',
      qrcode: {
        value: this.$host+'/#/m/personal/card/'+localStorage.getItem("userid"),
        size: 120,
        backgroundAlpha: 1
      }
    }
  },
  mounted () {
    this.getMessage();
    this.hosturl='https://'+window.location.host+'/#';
  },
  methods:{
      getMessage() {
        this.params.user_id='';
        this.params.token='';
        axios.all([this.$ajax.get('/user/detail/'+this.$route.query.id,{
            params: {
                user_id: localStorage.getItem('userid') || '',
                token: localStorage.getItem('token') || ''
            }
        }),
        this.$ajax.get('/user/dynamiclist/'+this.$route.query.id,{
            params: this.params
        })])
        .then(axios.spread((answerlist,dynamiclist) => {
            this.getdata(answerlist);
            this.getdynamic(dynamiclist);
            this.$NProgress.done();
            this.totalshow=true;
        })).catch((error) => {
            console.log(error)
      })
    },
    //获取专家信息
    getdata(res){
        let userinfo = res.data.data;
        if(userinfo.professor_status==0||userinfo.user_status==2){
            this.nodata=true;
        }
        if(userinfo.is_follow==1){
            this.toadd='已关注'
        }else{
            this.toadd='关注'
        }
        if(userinfo.is_open_ask===1){
            this.showask=true;
        }else{
            this.showask=false;
        }
        this.status=userinfo.is_follow;
        this.expertinfo=userinfo;
   },
    //获取项目信息
    getproject(res){
        let [projectlist,arr,arr_list] = [res.data.data.data,'',[]];
        this.totalpageProject=res.data.data.total;
        if(this.totalpageProject==0){
            this.showdynamic=false;
        }else{
            this.showdynamic=true;
        }
        for(let i = 0; i<projectlist.length;i++){
            arr={
                id:projectlist[i].id,
                name:projectlist[i].project_name,
                desc:projectlist[i].project_desc,
                img:projectlist[i].project_img,
                desctotal:projectlist[i].project_desc,
                projectshow:false,
                upordown:'查看详情',
                num:0
            }
            if(arr.desc.length>130){
                arr.desc=arr.desc.substring(0,129)+'...';
                arr.descshort=arr.desc;
                arr.projectshow=true;
            }
            arr_list.push(arr);
        }
        this.expertProjectList=arr_list;
    },
    projectdetails(index){
        for(let i = 0; i<this.expertProjectList.length;i++){
            if(this.expertProjectList[i].id==index){
                if(this.expertProjectList[i].num===0){
                    this.expertProjectList[i].desc=this.expertProjectList[i].desctotal;
                    this.expertProjectList[i].upordown='收起';
                    this.expertProjectList[i].num=1;
                }else{
                    this.expertProjectList[i].desc=this.expertProjectList[i].descshort;
                    this.expertProjectList[i].upordown='查看详情';
                    this.expertProjectList[i].num=0;
                }

            }
        }
    },
    //获取动态信息
    getdynamic(res){
        let [courselist,arr,arr_list]=[res.data.data.data,'',[]];
        this.totalpageProject=res.data.data.total;
        if(this.totalpageProject==0){
            this.showdynamic=false;
        }else{
            this.showdynamic=true;
        }
        for(let i = 0; i<courselist.length;i++){
            arr={
            create_time:courselist[i].create_time,
            title:courselist[i].dynamic_data.title,
            subtitle:courselist[i].dynamic_data.subtitle,
            content:courselist[i].dynamic_data.content,
            images:courselist[i].dynamic_data.images,
            url:courselist[i].dynamic_data.url?this.hosturl+courselist[i].dynamic_data.url.split('#')[1]:'',
            }
            if(arr.images){
                for(let j = 0; j<arr.images.length;j++){
                    arr.images[j]=this.$getImageUrl(arr.images[j],212,136)
                }
            }
            if(arr.content){
                if(arr.content.length>73){
                    arr.content=arr.content.substring(0,72)+"...";
                    arr.ifshow=true;
                }else{
                    arr.ifshow=false;
                }
            }else{
                arr.ifshow=false;
            }
            arr_list.push(arr);
        }
        this.expertDynamicList=arr_list;
    },
      handleClick(){
          this.showdynamic=true;
          if(this.activeName=='first'){
              this.params.p=1;
              this.currentPage=1;
              this.getdynamiclist();
          }else{
              this.projectParams.p=1;
              this.currentPage=1;
              this.getprojectlist();
          }
        },
      //改变项目页数
      changpageProject(e){
          if(this.activeName=='first'){
              this.params.p=e;
              this.currentPage=e;
              this.getdynamiclist();
          }else{
              this.projectParams.p=e;
              this.currentPage=e;
              this.getprojectlist();
          }
      },
      getprojectlist(){
        this.$ajax('/user/projectlist/'+this.$route.query.id,{
            params: this.projectParams
        }).then((res) => {
            this.getproject(res)
        }).catch((error) => {
            console.log(error)
        })
      },
      getdynamiclist(){
        this.$ajax('/user/dynamiclist/'+this.$route.query.id,{
            params: this.params
        }).then((res) => {
            this.getdynamic(res)
        }).catch((error) => {
            console.log(error)
        })
      },
      //关注某人
      toattention(){
          this.loadshow=true;
          this.toadd=`<i class="el-icon-loading"></i>加载中`;
          let t ='',title='',toadd='';
          if(this.status==1){
              t='cancel';
              title='取消关注成功';
              toadd='关注';
          }else{
              t='add';
              title='关注成功，可在个人中心我的关注中查看';
              toadd='已关注';
          }
        if(this.haslogin()){
            let userid= localStorage.getItem("userid");
            let token= localStorage.getItem("token");
            this.$ajax({
                method: 'post',
                url: '/user/follow',
                data:{
                "follow_user_id":this.$route.query.id,
                "user_id":userid,
                "token":token,
                "t":t
                },
                contentType: "application/json"
            })
            .then((res) => {
                this.loadshow=false;
                this.$NProgress.done();
                if(res.data.result==='success'){
                    this.$alert(title, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            if(this.status==1){
                                this.status=0;
                            }else{
                                this.status=1;
                            }
                            this.toadd=toadd;
                        }
                    });
                }else{
                    this.$alert(res.data.data.errmsg, '提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                        // this.ifdated=true;
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

      },
      askqueation(){
          if(this.haslogin()){
              this.$router.push({ name: 'questionQuiz',query:{id:this.expertinfo.user_id}})
          }
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
#expertInformation{
    @media screen and ( min-width: 1380px ) {
        .expertInformation-inner {
            width: 1380px;
        }
    }
    @media screen and ( max-width: 1380px ) {
        .expertInformation-inner {
            width: 1200px;
        }
    }
}
.expertInformation-inner{
    // max-width: 1380px;
    margin: 0 auto;
    margin-top: 60px;
    margin-bottom: 20px;
    .expert-quizInfo{
      min-height: 180px;
      padding-bottom: 20px;
      background: #fff;
      display: flex;
      border-radius: 3px;
      padding: 0 10px 25px;
      position: relative;
      .quiz-expert-img{
        position: absolute;
        padding: 10px;
        background: #fff;
        top: -30px;
        width: 128px;
        height: 128px;
        border-radius: 3px;
        box-sizing: content-box;
        margin-left: 20px;
        img{
          width: 100%;
        }
        .attention-expert{
            width: 128px;
            height: 30px;
            border-radius: 3px;
            text-align: center;
            line-height: 30px;
            font-size: 14px;
            color: #333;
            margin-top: 10px;
            button{
                width: 128px;
                height: 30px;
                padding: 0;
                color: #333;
            }
        }
      }
      .quiz-expert-information{

        margin-left: 198px;
        font-size: 14px;
        color: #999;
        flex: 1;
        .expert-base{
          margin-top: 20px;
          height: 35px;
          border-bottom: 1px solid #cccccc;
          .expert-base-name{
            color: #333434;
            font-size: 24px;
            font-weight: 700;
            margin-right: 25px;
          }
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
              top: -9;
              right: 12px;
          }
          .expert-base-score{
              color: #212121;
          }
        }
        .expert-dsec{
          margin-top: 12px;
          margin-bottom: 20px;
          line-height: 25px;
          color: #333;
        }
        .centerline{
              padding-right: 12px;

        }
        .centerline-last{
            padding-left: 12px;
            border-left: 1px solid #ccc;
        }
        .expert-skill{
          line-height: 22px;
        }
        .expert-company{
          line-height: 22px;
          .social{
            padding-right: 10px;
            border-right: 1px solid #d5d5d5;
            margin-right: 10px;
          }
        }
      }
      .quiz-expert-price{
          a{
            display: inline-block;
            width: 180px;
            height: 40px;
            border-radius: 3px;
            text-align: center;
            line-height: 30px;
            font-size: 16px;
            color: #333;
            margin: 30px 38px 0 95px;

          }
          button{
            width: 180px;
            height: 40px;
            padding: 0;
            color: #333;
          }
          .show-code {
            margin: 30px 38px 0 95px;
            text-align: center;
          }
      }
    }
    .expertInformation-main{
        .checkdetails{
            color: #ff9000;
            cursor: pointer;
        }
        .nodata{
            text-align: center;
            margin-top: 100px;
            padding-bottom: 100px;
        }
        .el-tabs__header{
            margin: 0;
        }
        .el-tabs__nav-wrap::after{
            width: 0!important;
            height: 0;
        }
        .el-tabs__nav-wrap::after{
            width: 0;
            height: 0;
        }
        .el-tabs__item.is-active{
            color: #333;
        }
        .el-tabs__item{
            color: #999;
            font-size: 16px;
        }
        padding: 30px 30px 0;
        background: #fff;
        margin-top: 20px;
        border-radius: 3px;
        .expert-dynamic{
            li:nth-last-child(1){
                border: 0px;
            }
            li{
                width: 100%;
                border-bottom: 1px solid #f4f4f4;
                padding: 30px 0;
                .classify-list{
                    display: flex;
                    .expert-dynamic-img{
                        width: 80px;
                        height: 80px;
                        border-radius: 80px;
                        margin-right: 20px;
                        flex-shrink:0;
                        img{
                            width: 100%;
                        }
                        .expert-dynamic-date{
                            text-align: center;
                        }
                    }
                    .expert-dynamic-picture{
                        display: flex;
                        flex:1;
                        justify-content: flex-end;
                        .project-more-moren{
                            margin-right: 10px;
                            width: 212px;
                            height: 136px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .project-img{
                            margin-right: 10px;
                            width: 212px;
                            height: 136px;
                            img{
                                width: 100%;
                                height: 100%;
                            }
                        }
                        .project-more{
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
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
                    .expert-dynamic-info{
                        max-width: 460px;
                        .expert-dynamic-info-sort{
                            color: #999;
                            font-size: 14px;
                            height: 24px;
                        }
                        .expert-dynamic-info-courename{
                            font-size: 16px;
                            color: #333;
                            font-weight: 700;
                            margin-bottom: 10px;
                        }
                        .expert-dynamic-info-desc{
                            line-height: 20px;
                        }
                    }
                }

            }

        }
        .expert-projects{
            li:nth-last-child(1){
                border: 0px;
            }
            li{
                display: flex;
                padding: 30px 0;
                border-bottom: 1px solid #f4f4f4;
                .project-info{
                    max-width: 660px;
                    .project-info-name{
                        font-size: 16px;
                        color: #333;
                        font-weight: 700;
                        padding-top: 20px;
                        line-height: 16px;
                        padding-bottom: 20px;
                    }
                    .project-info-data{
                        font-size: 14px;
                        color: #999;
                        line-height: 28px;
                    }
                    .project-info-desc{
                        font-size: 14px;
                        color: #666;
                        line-height: 22px;
                        margin-top: 15px;
                    }
                }
                .projrct-picture{
                    display: flex;
                    flex:1;
                    justify-content: flex-end;
                    .project-img{
                        margin-right: 10px;
                        width: 212px;
                        height: 136px;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .project-more{
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
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
