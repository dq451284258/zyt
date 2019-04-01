<template>
  <div class="personal-card-image-m">
    <div class="img-box" v-show='showimg'><img :src="showimg" alt=""></div>
    <div class="persoanl-card-main-m" v-show="!showimg">
      <div id="card">
        <div class="card-head" :style="{ 'height': width+'px', 'background-image': 'url('+form.avatar+')' }">
          <div class="card-head-text">
            <!-- <router-link to="/m/personal/edit" v-show="isSelf"><div class="edit"><img src="../assets/mobile/edit-card.png" width="35" alt=""></div></router-link> -->
            <div class="card-head-text-content">
              <h2><strong>{{ form.name }}</strong></h2>
              <p><strong>{{ form.company }}</strong></p>
              <p><span>{{ form.skill.value }}</span><span>{{ form.position }}</span></p>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="item">
            <div class="item-head">
              <h3><strong>社会职务</strong></h3>
            </div>
            <div class="item-content">
              <p v-for="(s,index) in form.socialPosition.list" :key="index"><span>{{ s.social + " | " + s.position }}</span></p>
            </div>
          </div>
          <div class="item">
            <div class="item-head">
              <h3><strong>专长领域</strong></h3>
            </div>
            <div class="item-content">
              <ul>
                <li class="field" v-for="(f,index) in form.field.list" :key="index"><span>{{ f.name }}</span></li>
              </ul>
            </div>
          </div>
          <div class="item">
            <div class="item-head">
              <h3><strong>技能</strong></h3>
            </div>
            <div class="item-content">
              <ul>
                <li><span>{{ form.skill.value }}</span></li>
              </ul>
            </div>
          </div>
          <div class="item">
            <div class="item-head">
              <h3><strong>项目经验</strong></h3>
            </div>
            <div class="item-content">
              <div class="item-li" v-for="(p,index) in form.projects.list" :key="index" v-show="index <= form.projects.more">
                <img :src="p.img" alt="">
                <div class="text"><span>{{ p.name }}</span></div>
              </div>
              <!-- <div class="more-btn" v-show="form.projects.more <= 1"><el-button type="info" @click="form.projects.more = form.projects.list.length">点击查看更多项目</el-button></div> -->
            </div>
          </div>
          <div class="item">
            <div class="item-head">
              <h3><strong>个人经历</strong></h3>
            </div>
            <div class="item-content">
              <textarea class="" v-model="form.desc.value" readonly></textarea>
            </div>
          </div>
        </div>
        <div class="card-foot">
          <div class="code">
            <p><span>扫一扫关注“筑英台”</span></p>
            <p><img src="../assets/mobile/zytqrcode.jpg" width="120" alt=""></p>
          </div>
          <div class="code">
            <p><span>扫一扫查看简历</span></p>
            <qriously :value="qrcode.value" :size="qrcode.size" :backgroundAlpha="qrcode.backgroundAlpha"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import html2canvas from 'html2canvas'
  import { MessageBox } from 'mint-ui'
  const defaultuser = require('../assets/defaultuser.jpg')
  export default {
    name: 'personalCardImageM',
    data() {
      return {
        showimg: false,
        qrcode: {
          value: this.$host+'/#/m/personal/card/'+this.$route.params.userid,
          size: 120,
          backgroundAlpha: 1
        },
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
            img: '',
            more: 1
          },
          loading: false
        },
        width: document.documentElement.clientWidth,
        isSelf: false
      }
    },
    mounted() {
      this.getMessage()
      if(this.$route.params.userid === localStorage.getItem('userid')) {
        this.isSelf = true;
      }
    },
    methods: {
      getMessage() {
        axios.all([this.$ajax.get('/user/detail/'+localStorage.getItem('userid'),{
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
                img: this.$getImageUrl(cert[c].project_img, this.width, parseInt(this.width*2/3))
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
              avatar: res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar, this.width, this.width) : defaultuser,
              avatarValue: res.data.data.avatar ? res.data.data.avatar : '',
              // avatarLoading: false,
              professor_status: res.data.data.professor_status, //0:普通用户,n:第n次认证
              professor_certificate_verify: res.data.data.professor_certificate_verify, //0：未提交，1：提交中，2：通过，3：未通过
              // loading:false
              projects: {
                list: c_arr,
                value: c_arr,
                name: '',
                desc: '',
                img: '',
                more: 1
              },
              loading: false
            }
            MessageBox('提示', '长按可保存到手机')
            this.save()
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
      save() {
        html2canvas(document.querySelector("#card"), {scale:2,logging:false,useCORS:true}).then(canvas => {
          var type = 'png';
          var imgData = canvas.toDataURL(type);
          this.showimg = imgData;
        });
      }
    }
  }
</script>

<style lang='less'>
.personal-card-image-m {
  background: #fff;
  .img-box {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .persoanl-card-main-m {
    position: relative;
    .foot-btn {
      display: flex;
      justify-content: space-between;
      button {
        width: 100%;
        height: 50px;
        outline: none;
        border: none;
        color: #333;
      }
      .yellow {
        background-color: #fed900;
      }
      .grey {
        background-color: #666;
        color: #fff;
      }
    }
    .card-head {
      width: 100%;
      background-position: center center;
      background-size: 100%;
      background-repeat: no-repeat;
      position: relative;
      .card-head-text {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100px;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 15px 20px 0;
        .card-head-text-content {
          text-align: center;
          h2 {
            color: #fff;
          }
          p {
            margin: 5px 0;
            strong {
              color: #ccc;
            }
            span {
              margin-right: 10px;
            }
          }
        }
      }
      .edit {
        position: absolute;
        right: 20px;
        top: 15px;
      }
    }
    .card-body {
      padding: 15px;
      .item {
        margin-bottom: 10px;
        .item-head {
          color: #333;
          padding: 10px 0;
          strong {
            border-left: 4px solid #fed900;
            padding-left: 10px;
          }
        }
        .item-content {
          p {
            margin: 5px 0;
          }
          ul li {
            display: inline-block;
            line-height: 36px;
            background-color: #666;
            color: #fff;
            padding: 0 10px;
            margin: 0 10px 10px 0;
          }
          ul li.field {
            background-color: #333;
          }
          .item-li {
            width: 100%;
            position: relative;
            margin-bottom: 10px;
            img {
              width: 100%;
            }
            .text {
              position: absolute;
              z-index: 1;
              bottom: 4px;
              left: 0;
              right: 0;
              height: 36px;
              line-height: 36px;
              background-color: rgba(0, 0, 0, 0.5);
              padding: 0 10px;
            }
          }
          .more-btn {
            button {
              width: 100%;
            }
          }
          textarea {
            outline: none;
            resize: none;
            border: none;
            color: #666;
            font-size: 14px;
          }
        }
      }
    }
    .card-foot {
      width: 100%;
      text-align: center;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>
