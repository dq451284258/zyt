<template>
  <div class="personalAnswer">
    <div class="answer-title">我的回答</div>
    <div class="answer-set">
      <el-switch
        v-model="value3"
        active-text="on"
        inactive-text="off"
        @change='changprice'>
      </el-switch>
      <div class="set-price">
        <span class="set-price-desc">别人向我提问需要支付</span>
        <el-input v-model="inputdata" placeholder="请输入内容" :disabled="!value3"></el-input>
        <el-button type="primary" @click='setprice'>保存</el-button>
      </div>
    </div>
    <div class="question-head" v-show='askOpen'>
      <div class="question-head-title">
        <span class="question-title-tab">
          <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="待回答" name="first">
              <ul class='my-ask' v-if='showanswer'>
                <li v-for='(list,index) in datalist' :key='index'>
                  <div class="ask-main">
                    <div class="ask-name"><span>{{list.name}}</span>向你提问了问题</div>
                    <div class="ask-title" v-text='list.title'></div>
                    <div class="ask-desc">
                      <div class="ask-desc-title">问题描述：</div>
                      <div class="ask-desc-main" v-text='list.desc'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.askimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="add-answer" @click='toshowadd(index)'>添加回答</div>
                    <div class='add-answer-main' v-if='showadd==index'>
                      <el-input class='quiz-input' type="textarea" :rows="3" placeholder="请输入问题答案" v-model="questiondesc"></el-input>
                      <div class="expert-quizAddimg">
                        <ul class='addimg'>
                          <li v-for='(list,index) in answerimglist' :key='index'>
                            <img :src="list" alt="">
                            <i class="el-icon-delete" @click='tocancel(index)'></i>
                          </li>
                          <li @click="changeAvatar()"><i class='el-icon-circle-plus-outline'></i></li>
                        </ul>
                        <input type="file" id="uploadfilesanswer" class="file" @change="uploadanswer($event)">
                      </div>
                      <div class="add-answer-button">
                        <span class="add-answer-save" @click='tosave(list.id)' :class="{'clicked':buttonstyle==1?true:false}"><el-button type="primary" :loading="loadshow" v-html='submittext'></el-button></span>
                      </div>
                    </div>
                  </div>
                  <div class="ask-date" v-text='list.date'></div>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="已回答" name="second">
              <ul class='my-ask' v-if='showanswer'>
                <li v-for='(list,index) in datalist' :key='index'>
                  <div class="ask-main">
                    <div class="ask-name"><span>{{list.name}}</span>向你提问了问题</div>
                    <div class="ask-title" v-text='list.title'></div>
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
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="answer-status" v-if='list.status==3?true:false'>已退款</div>
                  </div>
                  <div class="ask-date" v-text='list.date'></div>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
          <div class="nodata" v-if='!showanswer'>
            <img src="../assets/nomessage.png" alt="">
          </div>
          <div class="page"  v-show='showanswer'>
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change='changpage'
              :current-page="currentPage"
              :page-size="pageSize"
              :total="totalpage">
            </el-pagination>
          </div>
        </span>
      </div>
      <div class="clearboth" style='clear:both'></div>
      <div class="question-head-search">
        <el-input placeholder="请输入关键字搜索" v-model="searchinput" class="input-with-select" @keyup.enter.native='search'>
          <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
        </el-input>
      </div>
    </div>
    <div class="question-head" v-show='!askOpen'>
      <div class="question-head-title">
        <span class="question-title-tab">
          <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="已回答" name="first">
              <ul class='my-ask' v-if='showanswer'>
                <li v-for='(list,index) in datalist' :key='index'>
                  <div class="ask-main">
                    <div class="ask-name"><span>{{list.name}}</span>向你提问了问题</div>
                    <div class="ask-title" v-text='list.title'></div>
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
                      <div class="ask-answer-title">回答：</div>
                      <div class="ask-answer-main" v-text='list.answer'></div>
                      <ul class='descImg'>
                        <li v-for='(imgs,index) in list.answerimg' :key='index'>
                          <img :src="$imageHost+imgs.file_path" alt="">
                        </li>
                      </ul>
                    </div>
                    <div class="answer-status" v-if='list.status==3?true:false'>已退款</div>
                  </div>
                  <div class="ask-date" v-text='list.date'></div>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
          <div class="nodata" v-if='!showanswer'>
            <img src="../assets/nomessage.png" alt="">
          </div>
          <div class="page"  v-show='showanswer'>
            <el-pagination
              background
              layout="prev, pager, next"
              @current-change='changpage'
              :current-page="currentPage"
              :page-size="pageSize"
              :total="totalpage">
            </el-pagination>
          </div>
        </span>
      </div>
      <div class="clearboth" style='clear:both'></div>
      <div class="question-head-search">
        <el-input placeholder="请输入关键字搜索" v-model="searchinput" class="input-with-select" @keyup.enter.native='search'>
          <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
        </el-input>
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
  name: 'personalAnswer',
  data () {
    return {
      activeName:'first',
      searchinput:'',
      datalist:[],
      totalpage:1,
      pageSize:10,
      currentPage:1,
      dialogImageUrl: '',
      dialogVisible: false,
      questiondesc:'',
      buttonstyle:0,
      showadd:1000,
      value3: false,
      inputdata:'',
      params:{
        l:10,
        p:1
      },
      answerimglist:[],
      askPrice:'',
      askOpen:false,
      showanswer:true,
      submittext:'提交',
      loadshow:false
    }
  },
  mounted () {
    this.getaskStatus()
  },
  methods:{
    getaskStatus(){
      let userid=localStorage.getItem("userid");
      this.$ajax('/user/detail/'+userid,{
        params: {
          user_id: localStorage.getItem('userid') || '',
          token: localStorage.getItem('token') || ''
        }
      }).then((res) => {
        if(res.data.data.is_open_ask==1){
          this.value3=true;
          this.getMessage();
          this.askOpen=true;
          this.params.t='wait';
        }else{
          this.value3=false;
          this.getMessage();
          this.askOpen=false;
          this.params.t='done';
        }
        this.inputdata=res.data.data.ask_price;
      }).catch((error) => {
        console.log(error)
      })
    },
    getMessage() {
      this.params.user_id=localStorage.getItem('userid') || '';
      this.params.token=localStorage.getItem('token') || '';
      this.params.k='';
      axios.all([this.$ajax.get('/user/myanswer',{
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
      let [answerlist,arr,arr_list]=[res.data.data.data,'',[]];
      this.totalpage=res.data.data.total;
      if(this.totalpage==0){
        this.showanswer=false;
        // this.askOpen=false;
      }else{
        this.showanswer=true;
      }
      for(let i = 0; i<answerlist.length;i++){
        arr={
          id:answerlist[i].ask_id,
          name:answerlist[i].ask_user_name?answerlist[i].ask_user_name:'昵称',
          title:answerlist[i].ask_title,
          desc:answerlist[i].ask_description,
          answer:answerlist[i].answer_content,
          status:answerlist[i].ask_status,
          date:answerlist[i].create_time,
          answerimg:answerlist[i].answer_images,
          askimg:answerlist[i].ask_images
        }
        arr_list.push(arr);
      }
      this.datalist=arr_list;
    },
    changprice(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      let typevalue='';
      let data = {};
      if(this.value3){
        data={
          "type":'open',
          "user_id":userid,
          "token":token
        }
      }else{
        data={
          "type":'close',
          "user_id":userid,
          "token":token,
        }
      }
      this.$ajax({
        method: 'post',
        url: '/user/myopenqa',
        data:data,
        contentType: "application/json"
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result==='success'){
          this.$alert('提问设置更改成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.getaskStatus();
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
    handleClick(){
      this.currentPage=1;
      this.params.p=1;
      this.getsearchdata();
    },
    getsearchdata(){
      if(this.activeName=='first'){
        this.params.t='wait'
      }else{
        this.params.t='done'
      }
      this.$ajax('/user/myanswer',{
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
    toshowadd(index){
      this.showadd=index;
    },
    tosave(id){
      this.submittext=`<i class="el-icon-loading"></i>加载中`;
      this.loadshow=true;
      if(this.questiondesc==''){
        this.$alert('问题答案不能为空', '提示', {
          confirmButtonText: '确定'
        });
        this.submittext=`提交`;
        this.loadshow=false;
        return false;
      }
      this.buttonstyle=1;
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      this.$ajax({
        method: 'post',
        url: '/qa/asubmit',
        data:{
          "qid":id,
          "user_id":userid,
          "token":token,
          "answer_content":this.questiondesc,
          "img":this.getImageUrl(this.answerimglist)
        },
        contentType: "application/json"
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result==='success'){
          this.$alert('回答成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              // this.$router.push({ name: 'personalMyanswer'})
              // location.reload();
              this.questiondesc='';
              this.submittext='提交';
              this.loadshow=false;
              this.showadd=-1;
              this.answerimglist=[];
              this.getaskStatus();
            }
          });
        }else{
          this.getaskStatus();
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
    tosubmit(){
      this.buttonstyle=2;
    },
    tocancel(index){
      this.answerimglist.splice(index, 1);
    },
    changeAvatar() {
      document.getElementById('uploadfilesanswer').click()
    },
    showCropperadd(file, w, h) {
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
              _this.getQiniuFileanswer(this.file)
            }else {
              _this.getQiniuFileanswer(this.newFile)
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
    uploadanswer(e) {
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
      this.showCropperadd(file, 212, 136);
    },
    getQiniuFileanswer(file) {
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
          this.toqiniuproject(file, key, Qntoken, putExtra, config);
      }else{
        this.$ajax.get('/other/qiniu').then((res) => {
          this.SetCookie('Qntoken',res.data.data.token);
          this.toqiniuproject(file, key, res.data.data.token, putExtra, config);
        })
      }
      document.getElementById('uploadfile').value = '';
    },
    toqiniuproject(file, key, Qntoken, putExtra, config) {
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
          let domain = 'http://zyt-file.arctron.cn';
          let fopArr = [];
          fopArr.push({
              fop: "imageView2",
              mode: 2,
              h: 136,
              w: 212,
              q: 100
          });
          var newUrl = qiniu.pipeline(fopArr, key, domain);
          imgList = newUrl || defaultuser;
          _this.answerimglist.push(imgList);
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
    },
    //设置价格
    setprice(){
      let userid= localStorage.getItem("userid");
      let token= localStorage.getItem("token");
      let typevalue='';
      let data = {};
      if(this.inputdata<0){
        this.$alert('提问价格不能小于0，请重新输入', '提示', {
          confirmButtonText: '确定',
        });
        return false;
      }
      if(this.value3){
        data={
          "type":'open',
          "user_id":userid,
          "token":token,
          "price":parseFloat(this.inputdata)
        }
      }else{
        data={
          "type":'close',
          "user_id":userid,
          "token":token,
        }
      }
      this.$ajax({
        method: 'post',
        url: '/user/myopenqa',
        data:data,
        contentType: "application/json"
      })
      .then((res) => {
        this.$NProgress.done();
        if(res.data.result==='success'){
          this.$alert('提问价格设置成功', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              // this.$router.push({ name: 'personalMyanswer'})
              // location.reload();
              this.getaskStatus();
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
<style lang='less'>
.personalAnswer{
  padding: 20px 20px 0 32px;
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
  .answer-set{
    padding-bottom: 28px;
    border-bottom: 1px solid #f4f4f4;
    .el-switch{
      margin: 18px;
    }
    .set-price{
      font-size: 14px;
      color: #999;
      .set-price-desc{
        margin-right: 20px;
      }
    }
    .el-input{
      width: 205px;
      height: 42px;
      margin-right: 10px;
      .el-input__inner{
        height: 42px;
      }
    }
    button{
      width: 120px;
      font-size: 16px;
      color: #666;
    }
  }
  .answer-title{
    font-size: 16px;
    font-weight: 700;
    color: #2f2e2e;
    line-height: 40px;
    margin-right: 30px;
    position: relative;
    width: 70px;
  }
  .answer-title:before{
    content:'';
    width: 4px;
    height: 12px;
    background: #fed900;
    position: absolute;
    top: 14px;
    left: -32px;
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
    padding-top: 20px;
    .question-head-title{
      display: flex;
      
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
        .el-textarea__inner{
          background: #f4f4f4;
          height: 130px;
        }
        .my-ask{
          background: #fff;
          li{
            display: flex;
            padding: 28px 0;
            border-bottom: 1px solid #f4f4f4;
            font-size: 14px;
            color: #333333;
            .expert-quizAddimg{
              margin-top: 20px;
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
                  padding:0;
                  i{
                    font-size: 40px;
                    color: #ccc;
                    width: 100%;
                    text-align: center;
                    line-height: 136px;
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
            .ask-main{
              flex: 1;
              .answer-status{
                width: 110px;
                height: 30px;
                line-height: 30px;
                color: #333;
                background: #eee;
                font-size: 14px;
                text-align: center;
                margin-top: 20px;
              }
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
              }
            }
            .ask-title{
              font-weight: 700;
              // height: 34px;
              margin-bottom: 15px;
              margin-top: 5px;
            }
            .ask-desc{
              padding-bottom: 12px;
              .ask-desc-title{
                color: #ff9000;
                height: 20px;
              }
              .ask-desc-main{
                color: #666;
                line-height: 23px;
              }
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
                    margin-top: 20px;
                  }
                }
                
              }
            }
            .add-answer{
              display: inline-block;
              margin-bottom: 22px;
              color: #999;
              font-size: 14px;
              border-bottom: 1px solid #999;
              cursor: pointer;
            }
            .expert-quizAddimg{
              margin-top: 22px;
            }
            .add-answer-button{
              .add-answer-save{
                display: inline-block;
                border-radius: 3px;
                width: 120px;
                height: 42px;
                text-align: center;
                line-height: 42px;
                font-size: 16px;
                color: #666;
                margin-right: 10px;
                margin-top: 20px;
                cursor: pointer;
                button{
                  width: 120px;
                  height: 42px;
                  padding: 0;
                }
              }
              .clicked{
                background: #fed900;
                border: 1px solid #fed900;
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
              }
              .ask-answer-main{
                color: #666;
                line-height: 23px;
                // margin-bottom: 34px;
              }
              .ask-answer-appeal{
                color: #999;
                text-align: right;
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
      top: 20px;
      right: 0;
    }
  }
}
</style>
