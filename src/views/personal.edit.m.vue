<template>
  <div class="personal-edit-m">
    <div class="personal-edit-content-m">

      <div class="body">
        <div class="body-scroll">
          <mt-tab-container v-model="active" swipeable>
            <mt-tab-container-item id="main">
              <div class="body-main">
                <div class="head">
                  <div class="left">
                    <div class="image" :style="{'background-image': 'url('+form.avatar+')'}"></div>
                    <div class="btn"><el-button type="primary" @click="changeAvatar('avatar')">编辑</el-button></div>
                  </div>
                  <div class="right">
                    <div class="item-msg"><label for="">昵称</label><input type="text" v-model="form.nickName" placeholder="请输入昵称" maxlength="8"></div>
                    <div class="item-msg"><label for="">名字</label><input type="text" v-model="form.name" placeholder="请输入姓名" maxlength="8" :readonly="!editStatus"></div>
                    <div class="item-msg mid"><label for="">职位</label><input type="text" v-model="form.position" placeholder="请输入职位" maxlength="10"></div>
                    <div class="item-msg"><label for="">公司</label><input type="text" v-model="form.company" placeholder="请输入公司" maxlength="20"></div>
                  </div>
                </div>
                <!-- <vue-scroll :ops="ops" ref="vs"> -->
                <div class="content">
                  <div class="item">
                    <div class="item-li" @click="showItem('social')">
                      <div class="title"><label for=""><span>社会职务</span></label></div>
                      <div class="content">
                        <ul>
                          <li v-for="(s,index) in form.socialPosition.list" :key="index"><span>{{ s.social + " / " + s.position }}</span></li>
                        </ul>
                      </div>
                      <div class="right-icon"><i class="el-icon-arrow-right"></i></div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-li" @click="showItem('field')">
                      <div class="title"><label for=""><span>专长领域</span></label></div>
                      <div class="content">
                        <ul>
                          <li  v-for="(f,index) in form.field.list" :key="index"><span>{{ f.name }}</span></li>
                        </ul>
                      </div>
                      <div class="right-icon"><i class="el-icon-arrow-right"></i></div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-li" @click="showSkill">
                      <div class="title"><label for=""><span>技能</span></label></div>
                      <div class="content">
                        <input class="skill-input" placeholder="请选择技能专长" readonly type="text" v-model="form.skill.value" />
                      </div>
                      <div class="right-icon"><i class="el-icon-arrow-right"></i></div>
                    </div>
                    <mt-actionsheet class="skill-action" :actions="form.skill.list" v-model="form.skill.show"></mt-actionsheet>
                  </div>
                  <div class="item">
                    <div class="item-li">
                      <div class="title"><label for=""><span>电话</span></label></div>
                      <div class="content">
                        <input class="skill-input" readonly type="text" v-model="form.mobile" />
                      </div>
                      <div class="right-icon disable"><i class="el-icon-arrow-right"></i></div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-li">
                      <div class="title"><label for=""><span>邮箱</span></label></div>
                      <div class="content">
                        <input class="" type="text" v-model="form.email" />
                      </div>
                      <div class="right-icon disable"><i class="el-icon-arrow-right"></i></div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-li" @click="showItem('proj')">
                      <div class="title"><label for=""><span>项目经验</span></label></div>
                      <div class="content"></div>
                      <div class="right-icon"><i class="el-icon-arrow-right"></i></div>
                    </div>
                    <div class="item-li-projs">
                      <div class="proj-item" v-for="(p,index) in form.projects.list" :key="index" :style="{'background-image': 'url('+$getImageUrl(p.img, 300, 200)+')'}">
                        <div class="text"><span>{{ p.name }}</span></div>
                      </div>
                    </div>
                  </div>
                  <div class="item">
                    <div class="item-li" @click="showItem('desc')">
                      <div class="title"><label for=""><span>个人经验</span></label></div>
                      <div class="content">
                        <input class="" type="text" readonly v-model="form.desc.value" />
                      </div>
                      <div class="right-icon"><i class="el-icon-arrow-right"></i></div>
                    </div>
                  </div>
                  <div class="foot">
                    <el-button type="primary" @click="onSubmit" :loading="form.loading">保存</el-button>
                  </div>
                </div>
                <!-- </vue-scroll> -->
              </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="add" class="body-add">
              <div class="add-li" id="social" v-show="activeItem === 'social'">
                <div class="item-save">
                <transition name="el-fade-in" v-for="(s,index) in form.socialPosition.list" :key="index">
                  <div class="item-save-li">
                    <span>{{ s.social + " / " + s.position }}</span>
                    <i class="el-icon-circle-close-outline" @click="clearSocialPosition(index)"></i>
                  </div>
                </transition>
                </div>
                <div class="item-add">
                  <div class="item-add-li"><label for="">社会组织</label><input type="text" placeholder="请输入组织名称" v-model="form.socialPosition.social" maxlength="20"></div>
                  <div class="item-add-li"><label for="">职务</label><input type="text" placeholder="请输入职务名称" v-model="form.socialPosition.position" maxlength="10"></div>
                  <div class="item-add-btn">
                    <button class="add-button" :class="{'active': form.socialPosition.social && form.socialPosition.position}" @click.prevent="form.socialPosition.social && form.socialPosition.position && addSocialPosition()">添加</button>
                  </div>
                </div>
              </div>
              <div class="add-li" id="field" v-show="activeItem === 'field'">
                <div class="item-save">
                <transition name="el-fade-in" v-for="(f,index) in form.field.list" :key="index">
                  <div class="item-save-li">
                    <span>{{ f.name }}</span>
                    <i class="el-icon-circle-close-outline" @click="clearField(index)"></i>
                  </div>
                </transition>
                </div>
                <div class="item-add">
                  <div class="item-add-li"><label for="">专长领域</label><input type="text" placeholder="请输入专长领域" v-model="form.field.field" maxlength="10"></div>
                  <div class="item-add-btn">
                    <button class="add-button" :class="{'active': form.field.field}" @click.prevent="form.field.field && addField()">添加</button>
                  </div>
                </div>
              </div>
              <div class="add-li" id="proj" v-show="activeItem === 'proj'">
                <div class="item-save item-save-proj">
                <transition name="el-fade-in" v-for="(p,index) in form.projects.list" :key="index">
                  <div class="item-proj-li" :style="{'background-image': 'url('+$getImageUrl(p.img, 300, 200)+')'}">
                    <div class="text"><span>{{ p.name }}</span></div>
                  </div>
                </transition>
                </div>
                <div class="item-add">
                  <div class="item-add-li"><label for="">项目名称</label><input type="text" placeholder="请输入项目名称" v-model="form.projects.name"></div>
                  <div class="item-add-li"><label for="">项目描述</label><input type="text" placeholder="请输入项目描述" v-model="form.projects.desc"></div>
                  <div class="item-add-li"> <label for="">项目图片</label></div>
                  <div class="item-add-li">
                    <div class="add-image-box" v-show="form.projects.img" :style="{'background-image': 'url('+form.projects.img+')'}"></div>
                    <div class="add-image" @click="changeAvatar('proj')"><i class="el-icon-plus"></i><input type="file" id="uploadfile" @click.stop class="upload" @change="upload($event)"></div>
                  </div>
                  <div class="item-add-btn">
                    <button class="add-button" :class="{'active': form.projects.name && form.projects.desc && form.projects.img}" @click.prevent="form.projects.name && form.projects.desc && form.projects.img && addProj()">添加</button>
                  </div>
                </div>
              </div>
              <div class="add-li" id="desc" v-show="activeItem === 'desc'">
                <div class="item-add">
                  <div class="item-add-li">
                    <textarea maxlength='200' placeholder="请输入个人经验" v-model="form.desc.text"></textarea>
                  </div>
                  <div class="item-add-btn">
                    <button class="add-button active" @click.prevent="addDesc()">添加</button>
                  </div>
                </div>
              </div>
            </mt-tab-container-item>
            <!-- <div class="body-add"> -->
              <!-- <v-touch class="body-touch" v-on:swiperight="closeItem"> -->


              <!-- </v-touch> -->
            <!-- </div> -->
          </mt-tab-container>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  // const VueTouch = require('vue-touch')
  // Vue.use(VueTouch, {name: 'v-touch'})
  import { Actionsheet } from 'mint-ui'
  Vue.component(Actionsheet.name, Actionsheet)
  import { Toast } from 'mint-ui';
  import * as qiniu from 'qiniu-js';
  import { TabContainer, TabContainerItem } from 'mint-ui';
  Vue.component(TabContainer.name, TabContainer);
  Vue.component(TabContainerItem.name, TabContainerItem);
  const defaultuser = require('../assets/defaultuser.jpg');
  export default {
    name: 'personalEditM',
    data() {
      return {
        ops: {
          bar: {
            background: '#c1c1c1'
          }
        },
        show: false,
        height: 0,
        scrollLeft: 0,
        activeItem: 'main',
        active: 'main',
        form: {
          nickName: '',
          name: '',
          position: '',
          company: '',
          socialPosition: {
            social: '',
            position: '',
            list: [],
            value: [],
            showItem: false
          },
          field: {
            field: '',
            list: [],
            value: [],
            showItem: false
          },
          skill: {
            list: [],
            value: '',
            id: '',
            show: false
          },
          mobile: '',
          email: '',
          desc: {
            text: '',
            value: ''
          },
          avatar: '',
          avatarValue: '',
          professor_status: '',
          professor_certificate_verify: '',
          projects: {
            list: [],
            value: [],
            name: '',
            desc: '',
            img: ''
          },
          loading: false,
          ecard_show: 1
        },
        uploadType: '',
        editStatus: false
      };
    },
    mounted() {
      this.getMessage()
    },
    methods: {
      showItem(itemName) {
        this.show = !this.show;
        this.scrollLeft = '-100%';
        this.activeItem = itemName;
        this.active = 'add'
      },
      closeItem() {
        this.show = !this.show;
        this.scrollLeft = '0';
        this.activeItem = '';
        this.active = 'main'
      },
      getMessage() {
        axios.all([this.$ajax('/user/detail/'+localStorage.getItem('userid'),{
          params: {
            user_id: localStorage.getItem('userid'),
            token: localStorage.getItem('token')
          }
        }), this.$ajax.get('/user/projectlist/'+localStorage.getItem('userid'))]).then(axios.spread((res, projs) => {
          if(res.data.result === 'success') {
            let s_li = {},s_arr = [],sv_arr = [];
            for(let s = 0;s < res.data.data.social_position.length;s ++) {
              s_li = {
                social: res.data.data.social_position[s][0],
                position: res.data.data.social_position[s][1]
              }
              s_arr.push(s_li);
              sv_arr.push(res.data.data.social_position[s][0]+'|'+res.data.data.social_position[s][1])
            }
            let f_arr = [],fv_arr = [];
            for(let f = 0;f < res.data.data.expertise.length;f ++) {
              f_arr.push({
                name: res.data.data.expertise[f]
              });
              fv_arr.push(res.data.data.expertise[f])
            }
            let c_arr = [],cv_arr = [];
            for(let c = 0;c < projs.data.data.data.length;c ++) {
              let cert = projs.data.data.data;
              c_arr.push({
                name: cert[c].project_name,
                desc: cert[c].project_desc,
                img: cert[c].project_img
              })
            }
            this.form = {
              nickName: res.data.data.nickname,
              name: res.data.data.name,
              company: res.data.data.company,
              position: res.data.data.company_position,
              socialPosition: {
                social: '',
                position: '',
                list: s_arr,
                value: sv_arr
              },
              field: {
                field: '',
                list: f_arr,
                value: fv_arr
              },
              skill: {
                list: [],
                value: res.data.data.skill_name,
                id: res.data.data.skill_id === 0 ? '' : res.data.data.skill_id,
                show: false
              },
              mobile: res.data.data.phone,
              email: res.data.data.email,
              desc: {
                text: res.data.data.description,
                value: res.data.data.description
              },
              // cert: [],
              avatar: res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar, 100, 100) : defaultuser,
              avatarValue: res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar, 100, 100) : '',
              avatarLoading: false,
              professor_status: res.data.data.professor_status, //0:普通用户,n:第n次认证
              professor_certificate_verify: res.data.data.professor_certificate_verify, //0：未提交，1：提交中，2：通过，3：未通过
              // loading:false
              projects: {
                list: c_arr,
                value: c_arr,
                name: '',
                desc: '',
                img: ''
              },
              loading: false,
              ecard_show: res.data.data.ecard_show
            }
            if(res.data.data.professor_status > 0) {
              this.editStatus = false;
            }else {
              if(res.data.data.professor_certificate_verify === 1) {
                this.editStatus = false;
              }else {
                this.editStatus = true;
              }
            }
            this.$ajax('/expert/skill').then((res) => {
              // console.log(res);
              if(res.data.result === 'success') {
                let list = res.data.data;
                for(let i = 0;i < list.length;i ++) {
                  this.form.skill.list.push({
                    id: list[i].id,
                    name: list[i].name,
                    method: () => {
                      this.form.skill.value = list[i].name;
                      this.form.skill.id = list[i].id;
                    }
                  })
                }
              }
            })
          }else {
            if(res.data.data.errno === '-10002') {
              localStorage.setItem('token','');
              localStorage.setItem('userid','');
              this.$router.push('/m/login');
            }else {
              Toast(res.data.data.errmsg)
            }
          }
        })).catch((error) => {
          // console.log(error);
        });
      },
      addSocialPosition() {
        this.form.socialPosition.list.push({
          social: this.form.socialPosition.social,
          position: this.form.socialPosition.position
        })
        let val = this.form.socialPosition.social+'|'+this.form.socialPosition.position;
        this.form.socialPosition.value.push(val);
        this.form.socialPosition.social = '';
        this.form.socialPosition.position = '';
        setTimeout(() => {
          this.closeItem()
        }, 500)
      },
      clearSocialPosition(index) {
        this.form.socialPosition.list.splice(index,1);
        this.form.socialPosition.value.splice(index,1);
      },
      addField() {
        this.form.field.list.push({
          name: this.form.field.field
        });
        this.form.field.value.push(this.form.field.field);
        this.form.field.field = '';
        setTimeout(() => {
          this.closeItem()
        }, 500)
      },
      clearField(index) {
        this.form.field.list.splice(index,1);
        this.form.field.value.splice(index,1);
      },
      showSkill() {
        if(this.editStatus) {
          this.form.skill.show = true;
        }
      },
      addDesc() {
        this.form.desc.value = this.form.desc.text;
        setTimeout(() => {
          this.closeItem()
        }, 500)
      },
      onSubmit() {
        if(this.form.professor_status > 0) {
          if(!this.form.name || !this.form.skill.id) {
            Toast('请补全姓名跟技能！');
            return false;
          }
        }else {
          if(!this.form.nickName) {
            Toast('请补全昵称！');
            return false;
          }
        }
        this.form.loading = true;
        this.$ajax.post('/user/edit',{
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token'),
          savedata: {
            nickname: this.form.nickName,
            name: this.form.name,
            skill_id: this.form.skill.id === '' ? 0 : this.form.skill.id,
            cert: this.form.cert,
            avatar: this.getImageUrl(this.form.avatarValue),
            company: this.form.company,
            company_position: this.form.position,
            social_position: this.form.socialPosition.value,
            expertise: this.form.field.value,
            email: this.form.email,
            description: this.form.desc.value,
            phone: this.form.mobile
          },
          t: 'default'
        }).then((res) => {
          // console.log(res)
          this.form.loading = false;
          if(res.data.result === 'success') {
            Toast('保存成功！')
            this.getMessage()
            localStorage.setItem('token',res.data.data.token)
            setTimeout(() => {
              this.$router.push('/m/personal/card/'+localStorage.getItem('userid'))
            },500)
          }else {
            Toast(res.data.data.errmsg)
            this.getMessage()
          }
        }).catch((error) => {
        // console.log(error)
        })
      },
      getImageUrl(url) {
        if(url.search(this.$imageHost) != -1) {
          return url.split(this.$imageHost)[1]
        }else {
          return url
        }
      },
      changeAvatar(params) {
        this.uploadType = params;
        document.getElementById('uploadfile').click()
      },
      upload(e) {
        this.form.avatarLoading = true;
        let files = e.target.files;
        let fileName = files[0].name;
        let suffixIndex = fileName.lastIndexOf(".");
        let suffix = fileName.substring(suffixIndex+1).toUpperCase();
        if(suffix != "BMP" && suffix != "JPG" && suffix != "JPEG" && suffix != "PNG" && suffix != "GIF"){
          Toast('请上传图片！');
          this.form.avatarLoading = false;
          return false;
        }
        let file = files[0];
        if(!files){
          return false;
        }
        this.getQiniuFile(file, 300, 200);
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
        let observable = qiniu.upload(file, key, Qntoken, putExtra, config);
        observable.subscribe({
          next(res) {
              // ...
          },
          error(err) {
            Toast('上传失败，请重试');
          },
          complete(res) {
            let domain = _this.$imageHost;
            let fopArr = [];
            let h = 0, w = 0;
            if(_this.uploadType === 'avatar') {
              h = 300; w = 300;
            }else {
              h = 200; w = 300;
            }
            fopArr.push({
                fop: "imageView2",
                mode: 2,
                h: h,
                w: w,
                q: 100
            });
            let newUrl = qiniu.pipeline(fopArr, key, domain);
            if(_this.uploadType === 'avatar') {
              _this.form.avatar = newUrl;
              _this.form.avatarValue = newUrl;
            }else {
              _this.form.projects.img = newUrl;
            }

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
      addProj() {
        this.$ajax.post('/user/saveproject', {
          p_name: this.form.projects.name,
          p_desc: this.form.projects.desc,
          p_img: this.getImageUrl(this.form.projects.img),
          user_id: localStorage.getItem('userid'),
          token: localStorage.getItem('token')
        }).then((res) => {
          if(res.data.result === 'success') {
            Toast('添加成功！');
            this.form.projects.list.push({
              name: this.form.projects.name,
              desc: this.form.projects.desc,
              img: this.getImageUrl(this.form.projects.img)
            });
            setTimeout(() => {
              this.closeItem()
              this.form.projects.name = '';
              this.form.projects.desc = '';
              this.form.projects.img = '';
            }, 500)
          }
        }).catch((error) => {

        })
      }
    }
  }
</script>

<style lang='less'>
.personal-edit-m {
  width: 100%;
  height: 100%;
  .personal-edit-content-m {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    .head {
      background: #fff;
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      .left {
        padding: 0 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .image {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin:0 auto 15px auto;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center center;
        }
        .btn {
          button {
            width: 70px;
            height: 27px;
            border-radius: 20px;
            padding: 0;
            color: #333;
          }
        }
      }
      .right {
        flex-grow: 1;
        .item-msg {
          display: flex;
          justify-content: space-between;
          line-height: 36px;
          border-bottom: 1px solid #eee;
          label {
            color: #333;
            font-weight: bold;
          }
          input {
            border: none;
            height: 36px;
            outline: none;
            text-align: right;
            padding: 0 20px;
            color: #666;
            flex-grow: 1;
          }
        }
        :last-child {
          border: none;
        }
      }
    }
    .body {
      background: #fff;
      width: 100%;
      position: relative;
      overflow-x: hidden;
      overflow-y: scroll;
      flex-grow: 1;
      .body-scroll {
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        transition: all 0.3s;
        overflow-y: scroll;
        .mint-tab-container {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          .mint-tab-container-wrap {

          }
        }
      }
      .body-add {
        width: 100%;
        padding: 20px;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        float: right;
        height: 100%;
        .body-touch {
          width: 100%;
          min-height: 100%;
        }
        .add-li {
          min-height: 100%;
          .item-save-proj {
            justify-content: space-between;
          }
          .item-save {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            .item-save-li {
              box-shadow: 0 0 10px #ccc;
              padding: 5px;
              margin-bottom: 10px;
              margin-right: 10px;
            }
            .item-proj-li {
              position: relative;
              width: 150px;
              height: 100px;
              background-size: cover;
              margin-bottom: 10px;
              border: 1px solid #eee;
              .text {
                position: absolute;
                z-index: 1;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.7);
                line-height: 20px;
                height: 20px;
              }
            }
          }
          .item-add {
            padding: 10px 10px 0 10px;
            transition: all 0.15s;
            .item-add-li {
              border-bottom: 1px solid #eee;
              padding: 10px 0;
              display: flex;
              justify-content: space-between;
              label {
                color: #333;
                line-height: 36px;
              }
              input {
                border: none;
                height: 36px;
                outline: none;
                text-align: right;
                padding: 0 20px;
                color: #666;
                flex-grow: 1;
              }
              textarea {
                width: 100%;
                min-height: 200px;
                color: #666;
                padding: 5px;
                font-size: 14px;
              }
              .add-image {
                display: flex;
                text-align: center;
                width: 100px;
                height: 100px;
                border: 1px dashed #ccc;
                border-radius: 4px;
                font-size: 20px;
                position: relative;
                margin: 0 auto;
                i {
                  margin: 0 auto;
                  line-height: 98px;
                }
                .upload {
                  position: absolute;
                  left: 0;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  visibility: hidden;
                }
              }
              .add-image-box {
                width: 150px;
                height: 100px;
                background-size: cover;
                background-repeat: no-repeat;
              }
              .add-image:active {
                background: #eee;
              }
            }
            .item-add-btn {
              padding: 10px 0;
              .add-button {
                background: #ccc;
                border: 1px solid #ccc;
                cursor: pointer;
                width: 100%;
                height: 36px;
                outline: none;
                border-radius: 4px;
                transition: all 0.3s;
              }
              .add-button.active {
                background: #fed900;
                border: 1px solid #fed900;
              }
            }
          }
        }
      }
      .body-main {
        width: 100%;
        position: relative;
        background: #f4f4f4;
        float: left;
        .content {
          padding-left: 20px;
          padding-bottom: 50px;
          margin-top: 10px;
          background: #fff;
        }
        .item {
          padding: 10px 10px 10px 0;
          border-bottom: 1px solid #ccc;
          overflow: hidden;
          .skill-action ul{
            max-height: 360px;
            overflow-y: scroll;
          }
          .item-li {
            display: flex;
            justify-content: space-between;
            .title {
              line-height: 45px;
              label {
                color: #333;
                font-weight: bold;
                position: relative;
                padding-left: 10px;
              }
              label::before {
                content: '';
                width: 4px;
                height: 14px;
                background: #fadd1d;
                display: inline-block;
                position: absolute;
                top: 3px;
                left: 0;
              }
            }
            .content {
              flex-grow: 1;
              text-align: right;
              padding: 12px 10px 0 10px;
              margin: 0;
              width: 0;
              li {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              input {
                outline: none;
                border: none;
                width: 100%;
                text-align: right;
                color: #666;
              }
            }
            .right-icon {
              line-height: 45px;
            }
            .right-icon.disable {
              visibility: hidden;
            }
          }
          .item-li-projs {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            .proj-item {
              position: relative;
              width: 150px;
              height: 100px;
              background-size: cover;
              margin-bottom: 10px;
              border: 1px solid #eee;
              .text {
                position: absolute;
                z-index: 1;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: rgba(0,0,0,0.7);
                line-height: 20px;
                height: 20px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .foot {
      position: fixed;
      z-index: 1;
      left: 0;
      bottom: 0;
      right: 0;
      button {
        width: 100%;
        height: 50px;
        color: #333;
      }
    }
  }
}
</style>
