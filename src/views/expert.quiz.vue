<template>
  <div id="quiz">
    <div class="innerquiz">
      <div class="quiz-main">
        <div class="expert-quizInfo">
          <div class="quiz-expert-img">
            <img src="../assets/morenmoren.jpg" alt="" v-if='expertinfo.avatar==""?true:false'>
            <img :src="expertinfo.avatar?$imageHost+expertinfo.avatar:''" alt="">
          </div>
          <div class="quiz-expert-information">
            <div class="expert-base">
              <span class='expert-base-name' v-text='expertinfo.name'></span>
              <span class="expert-base-lavel" v-text='expertinfo.lavel'></span>
              <span class="expert-base-score" v-text='expertinfo.score'></span>
            </div>
            <div class="expert-dsec" v-text='expertinfo.description'></div>
            <div class="expert-skill">
              <span class='expert-skill-name' v-text='expertinfo.skill_name'></span>
              <span class='expert-skill-position' v-show='expertinfo.expertise?true:false'>
                <span class='skill-list' v-for='(skillitem,index) in expertinfo.expertise' :key='index' v-text='skillitem'></span>
              </span>
            </div>
            <div class="expert-company">
              <span class="expert-desc-company expert-desc-company-name" v-text='expertinfo.company'></span>
              <span class="expert-desc-position" v-text='expertinfo.company_position' v-show='expertinfo.company_position?true:false'></span>
            </div>
            <div class="expert-company">
              <div class="expert-desc-company" v-for='(lists,index) in expertinfo.social_position' :key='index'>
                <span class="social" v-text='lists[0]'></span>
                <span class="socialwork" v-text='lists[1]'></span>
              </div>
            </div>
          </div>
        </div>
        <div class="expert-quizDecribe">
          <div class="quiz-desctibe-title">
            问题题目
          </div>
          <el-input v-model="questiontitle" placeholder="请输入内容" class='quiz-input'></el-input>
          <div class="quiz-desctibe-title">
            问题描述
          </div>
          <el-input class='quiz-input' type="textarea" :rows="2" placeholder="请输入内容" v-model="questiondesc">
          </el-input>
        </div>
        <div class="expert-quizAddimg">
          <div class="quiz-addimg-title">
            添加图片
          </div>
          <ul class='addimg'>
            <li v-for='(list,index) in avatar' :key='index'>
              <img :src="list" alt="">
              <i class="el-icon-delete" @click='tocancel(index)'></i>
            </li>
            <li @click="changeAvatar()" v-if='addbutton'><i class='el-icon-circle-plus-outline'></i></li>
          </ul>
          <input type="file" id="uploadfile" class="file" @change="upload($event)">
        </div>
        <div class="expert-quizRule">
          <div class="quiz-rule-title">提问规则</div>
          <div class="quiz-rule">在这里，您可付费向专家提问。每个问题可上传3张图片，每张图片大小不超过5m。完成付费后，专家会在3日内进行答复，若专家未在3日内答复，则提问费用会在2个工作日内原路退回。</div>
        </div>
        <div class="expert-quizPay">
          <div class="pay-price">
            <span class="quiz-price-title">待支付</span>
            <span class='price-number'>￥{{expertinfo.ask_price}}</span>
          </div>
          <div class="pay-method">
            <span class="quiz-price-title">支付方式</span>
            <el-radio v-model="radio" label="1" :disabled='ifchoose' >余额
              <span class="balance">账户余额{{balance}}元</span>
            </el-radio>
            <el-radio v-model="radio" label="2" :disabled='ifzero'>
              <img src="../assets/zhifubao.png" alt="">
            </el-radio>
          </div>
          <div class="pay-button">
            <!-- <router-link to='/expert/payment'><el-button type="primary">去付款</el-button></router-link> -->
            <el-button type="primary" :loading="loadshow"  @click='postquestion'>去付款</el-button>
          </div>
        </div>
      </div>
      <div class="quiz-recommend">
        <div class="right-hot">
            <div class="hot-title">
              <div class="hot-title-name">专家过往回答</div>
              <div class="hot-title-more">
                <router-link to='/expert/questionHall'>查看更多</router-link>
              </div>
            </div>
            <ul class='hot-list'>
              <li v-for='(list,index) in questionList' :key="index">
                <div class="question-index">
                  <div class="question-index-num" v-text='index+1'></div>
                </div>
                <div class="question-info">
                  <div class="question-describe" v-text='list.question' @click='toquestiondetails(list.id)'></div>
                  <div class="question-skill" v-text='list.skill'></div>
                  <div class="question-name" @click='toexpertdetails(list.expertid)'>
                    {{list.name}} <span class='namegray'>回答</span>
                    <span class='likenum'>{{list.like}}人点赞</span>
                    <span class='checknum'>{{list.check}}人看过</span>
                  </div>
                  <div class="question-price" @click='toquestiondetails(list.id)'><el-button type="primary" v-if='list.isbuy==1?false:true'>￥{{list.price}}付费查看</el-button></div>
                  <div class='buyed' v-if='list.isbuy==1?true:false' @click='toquestiondetails(list.id)'>已购买，去查看</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="right-banner" @click="toactivity(bannerinfo.id)">
            <!-- <img src="../assets/bannermoren.jpg" alt="" v-if='bannerinfo.event_banner==""?true:false'> -->
            <!-- <img :src="$imageHost+bannerinfo.event_banner" alt=""> -->
            <img src="../assets/bannermoren.jpg" alt="">
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as qiniu from 'qiniu-js';
import Vue from 'vue';
import cropper from '@/components/cropper';
export default {
  name: 'quiz',
  data () {
    return {
      expertinfo:{},
      questiontitle:"",//问题名称
      questiondesc:'',//问题描述
      dialogImageUrl: '',
      dialogVisible: false,
      radio:'',//单选
      questionList:[],
      bannerinfo:'',
      avatar:[],
      addbutton:true,
      ifchoose:false,//余额是否可选
      questionid:'',
      balance:'',
      paychannel:'',
      loadtext:'去付款',
      loadshow:false,
      ifzero:false//零元不可支付包支付
    }
  },
  mounted () {
    this.getMessage();
  },
  methods:{
    getMessage() {
      axios.all([this.$ajax.get('/qa/expert',{
        params: {
          user_id:localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || '',
          eid: this.$route.query.id
        }
      }),this.$ajax.get('/user/detail/'+this.$route.query.id,{
        params: {
          user_id: localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || ''
        }
      })])
      .then(axios.spread((answerlist, userinfo) => {
        this.getexpertAnswer(answerlist);
        this.getUserinfo(userinfo);
        this.$NProgress.done();
      })).catch((error) => {
        console.log(error)
      })
    },
    account(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/myaccount',
        data:{
          "user_id":userid,
          "token":token
        },
        contentType: "application/json",
      })
      .then((res) => {
        localStorage.setItem('token',res.data.token);
        this.$NProgress.done();
        this.balance=res.data.data.balance;
        if(this.balance-this.expertinfo.ask_price<0){
          this.ifchoose=true
        }
      })
      .catch((res) => {
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
    //获取专家过往回答列表
    getexpertAnswer(res){
      let [datalist,arr,arr_list] = [res.data.data,'',[]];
      for(let i = 0; i<datalist.length;i++){
        arr={
          id:datalist[i].id,
          question:datalist[i].ask_title,
          skill:datalist[i].skill_name,
          name:datalist[i].answer_user_name,
          price:datalist[i].look_price,
          check:datalist[i].buy_num,
          isbuy:datalist[i].is_buy,
          like:datalist[i].like_num,
          expertid:datalist[i].answer_user_id
        }
        if(arr.question.length>50){
          arr.question=arr.question.substring(0,50)+"...";
        }
        arr_list.push(arr);
      }
      this.questionList=arr_list;
    },
    //获取专家信息
    getUserinfo(res){
      let expertdata= res.data.data;
      this.expertinfo=expertdata;
      if(this.expertinfo.ask_price==0){
        this.ifzero=true;
      }
      this.account();
    },
    //获取banner
    getBanner(res){
      let bannerinfo = res.data.data;
      this.bannerinfo=bannerinfo[0];
    },
    //提问问题
    postquestion(){
      if(this.questiondesc==''){
        this.$alert('问题描述不能为空', '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }else if(this.radio==''){
        this.$alert('请选择支付方式', '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }else if(this.questiontitle==''){
        this.$alert('问题题目不能为空', '提示', {
          confirmButtonText: '确定'
        });
        return false;
      }else{
        this.$confirm('你将购买该咨询服务,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loadshow=true;
          this.loadtext=`<i class="el-icon-loading"></i>加载中`;
          this.addorder();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消咨询'
          });
        });
      }
    },
    addorder(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/qa/qsubmit',
        data:{
          "eid":this.$route.query.id,
          "user_id":userid,
          "token":token,
          "title":this.questiontitle,
          "description":this.questiondesc,
          "img":this.getImageUrl(this.avatar)
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result==='success'){
              // this.$router.push({ name: 'expertPayment'})
              this.questionid=res.data.data.last_id;

              let system ={};
              let p = navigator.platform;
              system.win = p.indexOf("Win") == 0;
              system.mac = p.indexOf("Mac") == 0;
              system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
              if(system.win||system.mac||system.xll){//如果是电脑跳转到
                this.paychannel='web'
              }else{  //如果是手机,跳转到
                this.paychannel='wap'
              }
              this.topayment();
        }else{
          this.loadshow=false;
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
        this.loadshow=false;
        this.$alert(res.data.data.errmsg, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
    topayment(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/pay/pay',
        data:{
          user_id:userid,
          token:token,
          paymethod:this.radio,
          paychannel:this.paychannel,
          good_id:this.questionid,
          good_type:2,
          amount:this.expertinfo.ask_price,
          returnurl:'https://'+window.location.host + '/#/expert/payment'
        },
        contentType: "application/json",
      })
      .then((res) => {
        this.$NProgress.done();
        this.loadshow=false;
        if(this.radio==1){
          this.$router.push({ name: 'expertPayment'})
        }else{
          //不开新页面
          window.location.href=res.data.data.url;

          //开新页面
          // window.open(res.data.data.url);
          // setTimeout(() => {
            // this.$confirm('', '提示', {
            //   confirmButtonText: '已完成付款',
            //   cancelButtonText: '未完成付款',
            //   showClose:false,
            //   closeOnClickModal:false,
            //   center: true
            // }).then(() => {
            //   this.$router.push({ name: 'expertPayment'})
            // }).catch(() => {
            //   this.loadshow=false;
            //   this.loadtext='去付款';
            // });
          // },1000)
        }
      })
      .catch((res) => {
        this.loadshow=false;
        this.$alert(res, '提示', {
          confirmButtonText: '确定'
        });
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //专家过往回答列表点击去详情页
    toquestiondetails(id){
      this.$router.push({ name: 'expertAnswerDetails',query:{id:id}})
    },
    toexpertdetails(expertid){
      this.$router.push({ name: 'expertInformation',query:{id:expertid}})
    },
    //右边banner
    toactivity(id){
      // this.$router.push({ name: 'activityDetails',query:{id:id}})
    },
    tocancel(index){
      this.avatar.splice(index, 1);
    },
    changeAvatar() {
      if(this.avatar.length<3){
        document.getElementById('uploadfile').click()
      }else{
        this.$message({
          message: '最多添加3张图片',
          type: 'warning'
        });
      }
    },
    showCropper(file, w, h) {
      let ndiv = document.createElement('div');
      ndiv.setAttribute('id','imagecropper');
      document.body.appendChild(ndiv);
      const _this = this;
      let Cropper = Vue.extend({
        data() {
          return {
            file: file,
            w: w,
            h: h,
            newFile: ''
          }
        },
        components: {
          cropper
        },
        template: `<cropper :file="this.file" :w="this.w" :h="this.h" @closeCropper="this.closeCropper" @getNewFile="this.getNewFile"></cropper>`,
        methods: {
          closeCropper() {
            document.body.removeChild(document.getElementById('imagecropper'));
          },
          getNewFile(data) {
            this.newFile = this.dataURLtoFile(data,this.file.name);
            if(!this.newFile) {
              _this.getQiniuFile(this.file)
            }else {
              _this.getQiniuFile(this.newFile)
            }
            document.body.removeChild(document.getElementById('imagecropper'));
          },
          dataURLtoFile(dataurl) {
            return dataurl;
          }
        }
      });
      new Cropper().$mount('#imagecropper');
    },
    upload(e) {
      let files = e.target.files;
      let fileName = files[0].name;
      let suffixIndex = fileName.lastIndexOf(".");
      let suffix = fileName.substring(suffixIndex+1).toUpperCase();
      if(suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF"){
        this.$message.error('请上传图片！');
        return false;
      }
      let file = files[0];
      if(!files){
        return false;
      }
      this.showCropper(file, 212, 136);
    },
    getQiniuFile(file) {
      let Num = "";
      for(let i = 0; i < 6; i++) {
          Num += Math.floor(Math.random() * 10);
      }
      let key = new Date().getTime() + Num;
      let config = {
        useCdnDomain: true,
        region: qiniu.region.z0
      };
      let putExtra = {
        fname: '',
        params: {},
        mimeType: [] || null
      };
      let token = localStorage.getItem('token');
      if(this.GetCookie('Qntoken') && this.GetCookie('Qntoken') != 'undefined'){
          let Qntoken = this.GetCookie('Qntoken');
          this.toqiniu(file, key, Qntoken, putExtra, config);
      }else{
        this.$ajax.get('/other/qiniu').then((res) => {
          this.SetCookie('Qntoken',res.data.data.token);
          this.toqiniu(file, key, res.data.data.token, putExtra, config);
        })
      }
      document.getElementById('uploadfile').value = '';
    },
    toqiniu(file, key, Qntoken, putExtra, config) {
      let _this = this;
      let imgList='';
      let observable = qiniu.upload(file, key, Qntoken, putExtra, config);
      observable.subscribe({
        next(res) {
            // ...
        },
        error(err) {
          this.$message.error('上传失败，请重试');
        },
        complete(res) {
          let domain = _this.$imageHost;
          let fopArr = [];
          fopArr.push({
              fop: "imageView2",
              mode: 2,
              h: 136,
              w: 212,
              q: 100
          });
          let newUrl = qiniu.pipeline(fopArr, key, domain);
          imgList = newUrl || defaultuser;
          _this.avatar.push(imgList);
        }
      });
    },
    GetCookie(name) {
      let arg = name + "=";
      let alen = arg.length;
      let clen = document.cookie.length;
      let i = 0;
      while (i < clen) {
        let j = i + alen;
        if (document.cookie.substring(i, j) == arg) return this.getCookieVal(j);
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0) break;
      }
      return null;
    },
    SetCookie(name, value) {
      let Days = 30;
      let exp = new Date();
      exp.setTime(exp.getTime() + 60 * 15000);//过期时间 15分钟
      document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookieVal(offset) {
      let endstr = document.cookie.indexOf(";", offset);
      if (endstr == -1) endstr = document.cookie.length;
      return unescape(document.cookie.substring(offset, endstr));
    },
    getImageUrl(url) {
      let newlist =[];
      for(let i = 0; i<url.length;i++){
        if(url[i].search(this.$imageHost) != -1) {
          newlist.push(url[i].split(this.$imageHost)[1]);
          // return url[i].split(this.$imageHost)[1]
        }else {
          // return url[i]
          newlist.push(url[i]);
        }
      }
      return newlist;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#quiz{
  @media screen and ( min-width: 1380px ) {
        .innerquiz {
            width: 1380px;
        }
    }
    @media screen and ( max-width: 1380px ) {
        .innerquiz {
            width: 1200px;
        }
    }
}
.innerquiz{
  // max-width: 1380px;
  margin: 0 auto;
  display: flex;
  margin-top: 62px;
  .quiz-main{
    flex: 1;
    margin-bottom: 20px;
    .expert-quizInfo{
      padding-bottom: 20px;
      background: #fff;
      display: flex;
      border-radius: 3px;
      padding: 0 10px 20px;
      position: relative;
      .quiz-expert-img{
        position: absolute;
        padding: 8px;
        background: #fff;
        top: -30px;
        width: 114px;
        height: 114px;
        padding: 4px;
        img{
          width: 100%;
        }
      }
      .quiz-expert-information{

        margin-left: 144px;
        font-size: 12px;
        color: #212121;

        .expert-base{
          margin-top: 20px;
          height: 30px;
          .expert-base-name{
            color: #333434;
            font-size: 20px;
            font-weight: 700;
            margin-right: 10px;
            position: relative;
          }
          .expert-base-name:before{
              content: '';
              width: 9px;
              height: 9px;
              border-radius: 9px;
              background: url('../assets/fffff_03.png');
              position: absolute;
              top: -3px;
              right: -15px;
          }
          .expert-base-lavel{
            margin-right: 10px;
          }
        }
        .expert-dsec{
          line-height: 24px;
        }
        .expert-skill{
          line-height: 22px;
          color: #999;
          .expert-skill-name{
            padding-right: 10px;
            // margin-right: 10px;
          }
          .expert-skill-position{
            border-left: 1px solid #d5d5d5;
            margin-right: 10px;
            padding-left: 10px;
            .skill-list{
              margin-right: 10px;
            }
          }
        }
        .expert-company{
          line-height: 22px;
          color: #999;
          .expert-desc-company-name{
            padding-right: 10px;
          }
          .expert-desc-position{
            border-left: 1px solid #d5d5d5;
            padding-left: 10px;
          }
          .social{
            padding-right: 10px;
            border-right: 1px solid #d5d5d5;
            margin-right: 10px;
          }
        }

      }
    }
    .expert-quizDecribe{
      margin-top: 20px;
      padding: 30px 28px 0 28px;
      background: #fff;
      border-radius: 3px;
      .quiz-desctibe-title{
        display: inline-block;
        font-size: 16px;
        color: #2f2e2e;
        height: 28px;
        border-bottom: 3px solid #fed900;
      }
      .quiz-input{
        margin:30px 0;
      }
    }
    .expert-quizAddimg{
      margin-top: 20px;
      padding: 30px 28px;
      background: #fff;
      border-radius: 3px;
      .addimg{
        display: flex;
        li{
          width: 212px;
          height: 136px;
          border: 1px solid #cccccc;
          line-height: 148px;
          text-align: center;
          border-radius: 3px;
          position: relative;
          i{
            font-size: 40px;
            color: #ccc;
          }
          .el-icon-delete{
            width: 35px;
            height: 28px;
            background: #000;
            opacity: 0.3;
            font-size: 18px;
            line-height: 28px;
            border-radius: 0 3px 0 0;
            color:#fff;
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
      .quiz-addimg-title{
        margin-bottom: 30px;
        display: inline-block;
        font-size: 16px;
        color: #2f2e2e;
        height: 28px;
        border-bottom: 2px solid #fed900;
      }
      .file {
        visibility: hidden;
      }
}
    .expert-quizRule{
      margin-top: 20px;
      padding: 30px 28px;
      background: #fff;
      border-radius: 3px;
      .quiz-rule-title{
        display: inline-block;
        font-size: 16px;
        color: #2f2e2e;
        height: 28px;
        border-bottom: 2px solid #fed900;
      }
      .quiz-rule{
        line-height: 24px;
        color: #999;
        font-size: 14px;
        margin: 24px 0 8px 0;
      }
    }
    .expert-quizPay{
      margin-top: 20px;
      padding: 30px 28px 78px 28px;
      background: #fff;
      border-radius: 3px;
      .quiz-price-title{
        display: inline-block;
        font-size: 16px;
        color: #2f2e2e;
        height: 28px;
        border-bottom: 2px solid #fed900;
        margin-right: 50px;
      }
      .balance{
        color: #999;
        margin-left: 10px;
      }
      .pay-price{
        color: #ff9000;
        font-size: 20px;
      }
      .pay-method{
        margin-top: 50px;
      }
      .pay-button{
        display: flex;
        justify-content:center;
        a{
          display: inline-block;
          width: 225px;
          height: 48px;
          border-radius: 3px;
          text-align: center;
          line-height: 48px;

          color: #2f2e2e;
          button{
            width: 225px;
            height: 48px;
            color: #2f2e2e;
            padding: 0;
            font-size: 18px;
          }
        }
        margin-top: 50px;
      }
    }
  }
  .quiz-recommend{
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
              color: #666;
            }
          }
        }
        .hot-list{
          li:nth-of-type(1){
            border-top: 0;
          }
          li{
            display: flex;
            padding-top: 32px;
            padding-bottom: 28px;
            border-top: 1px solid #f4f4f4;
            .question-index{
              flex-shrink: 0;
              font-size: 14px;
              color: #2f2e2e;
              width: 30px;
              text-align: center;
              padding-top: 24px;
              .question-index-num{
                width: 18px;
                height: 18px;
                border-radius: 18px;
                background: #eee;
                text-align: center;
                line-height: 18px;
              }
            }
            .question-img{
              width: 82px;
              height: 90px;
              img{
                width: 100%;
              }
            }
            .question-info{
              margin-left: 15px;
              font-size: 12px;
              width: 100%;
              .buyed{
                color: #2f2e2e;
                width: 160px;
                height: 22px;
                border-radius: 3px;
                text-align: center;
                line-height: 22px;
                margin-top: 12px;
                background: #eee;
                cursor: pointer;
              }
              .question-describe{
                font-size: 14px;
                color: #2f2e2e;
                line-height: 20px;
                cursor: pointer;
              }
              .question-skill{
                color: #999;
                height: 28px;
              }
              .question-name{
                color: #ff9000;
                height: 30px;
                cursor: pointer;
                .namegray{
                  color: #2f2e2e;
                }
                .checknum{
                  margin-left: 35px;
                  position: relative;
                  color: #999;
                  float: right;
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
                  margin-left: 10px;
                  position: relative;
                  color: #999;
                  float: right;
                  padding-left: 25px;
                  border-left: 1px solid #cfcfcf;
                }
                .likenum:before{
                  content: '';
                  width: 12px;
                  height: 12px;
                  background-image: url('../assets/Like.png');
                  position: absolute;
                  top: 2px;
                  left: 9px;
                }
              }
              .question-price{
                display: inline-block;
                color: #2f2e2e;
                width: 154px;
                height: 22px;
                border-radius: 3px;
                background: #fff;
                text-align: center;
                line-height: 22px;
                cursor: pointer;
                button{
                  color: #2f2e2e;
                  width: 160px;
                  height: 22px;
                  padding: 0;
                }
              }
            }
          }
          li:nth-of-type(1){
            .question-index{
              .question-index-num{
                background:#fed900;
              }
            }
          }
          li:nth-of-type(2){
            .question-index{
              .question-index-num{
                background:#fed900;
              }
            }
          }
          li:nth-of-type(3){
            .question-index{
              .question-index-num{
                background:#fed900;
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
</style>
