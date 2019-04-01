<template>
  <div class="personal-preview-m">
    <div class="preview-main">
      <div class="preview-content">
        <div class="perview-auto">
          <div class="userinfo">
            <div class="userinfo-head">
              <div class="avatar" :style="{'background-image': 'url('+avatar+')'}"></div>
              <div class="name"><h4><strong>{{ name }}</strong></h4></div>
              <div class="edit"><router-link to="/m/personal/edit"><div class="edit-btn"><span>编辑</span></div></router-link></div>
            </div>
            <div class="userinfo-bot">
              <div class="userinfo-bot-auto" v-show="position">
                <h4><span class="position"></span></h4><h4><span class="title">{{ position }}</span></h4>
              </div>
              <div class="line" v-show="position && company"><i></i></div>
              <div class="userinfo-bot-auto" v-show="company">
                <h4><span class="company"></span></h4><h4><span class="title">{{ company }}</span></h4>
              </div>
            </div>
          </div>
        </div>
        <div class="perview-auto" v-show="isprof">
          <router-link :to="{path:'/m/personal/card/'+userid}" class="raw">
            <div class="left">
              <div class="icon"><img src="../assets/mobile/card.png" width="66" height="66" alt=""></div>
              <div class="title"><h4><span>电子名片</span></h4></div>
            </div>
            <div class="right"><i class="el-icon-arrow-right"></i></div>
          </router-link>
        </div>
        <div class="perview-auto">
          <router-link to="/m/personal/cards" class="raw">
            <div class="left">
              <div class="icon"><img src="../assets/mobile/cards.png" width="66" height="66" alt=""></div>
              <div class="title"><h4><span>名片卡包</span></h4></div>
            </div>
            <div class="right"><i class="el-icon-arrow-right"></i></div>
          </router-link>
        </div>
      </div>
      <div class="perview-footer">
        <el-button type="primary" @click.prevent="logout">退出账户</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  const defaultIamgeUser = require('../assets/defaultuser.jpg');
  import { Toast } from 'mint-ui';
  export default {
    name: 'personalPreviewM',
    data() {
      return {
        islogin: false,
        avatar: '',
        name: '',
        position: '',
        company: '',
        userid: localStorage.getItem('userid'),
        isprof: false
      }
    },
    mounted() {
      this.getMessage()
    },
    methods: {
      getMessage() {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userid');
        if(token && userid) {
          this.$ajax('/user/detail/'+userid,{
            params: {
              user_id: localStorage.getItem('userid'),
              token: localStorage.getItem('token')
            }
          }).then((res) => {
            this.avatar = res.data.data.avatar ? this.$getImageUrl(res.data.data.avatar,100,100) : defaultIamgeUser;
            this.name = res.data.data.name ? res.data.data.name : (res.data.data.nickname ? res.data.data.nickname : '昵称');
            this.position = res.data.data.company_position;
            this.company = res.data.data.company;
            this.isprof = res.data.data.professor_status > 0 ? true : false;
          }).catch(() => {
            this.$router.push('/m/login')
          })
        }else {
          this.$router.push('/m/login')
        }
      },
      logout() {
        this.$ajax.post('/user/logout', {
          userid: localStorage.getItem('userid'),
          wxopenid: localStorage.getItem('openid')
        }).then(res => {
          localStorage.setItem('token','');
          localStorage.setItem('userid','');
          localStorage.setItem('openid','');
          Toast('退出登录成功');
          setTimeout(() => {
            this.$router.push('/m/login');
          },1000)
        }).catch(error => {

        })

      }
    }
  }
</script>

<style lang='less'>
.personal-preview-m {
  width: 100%;
  height: 100%;
  .preview-main {
    height: 100%;
    position: relative;
    .preview-content {
      padding: 15px;
      width: 100%;
      background: url('../assets/mobile/bg_2@2x.png') no-repeat center top;
      background-size: 100%;
      margin-bottom: 90px;
      .perview-auto {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px #eee;
        padding: 10px;
        margin-bottom: 25px;
        .userinfo {
          .userinfo-head {
            height: 62px;
            display: flex;
            line-height: 62px;
            .avatar {
              border-radius: 50%;
              width: 62px;
              height: 62px;
              overflow: hidden;
              background-size: cover;
              background-repeat: no-repeat;
              background-position: center center;
            }
            .name {
              margin-left: 10px;
              font-size: 18px;
              color: #333;
            }
            .edit {
              flex-grow: 1;
              display: flex;
              justify-content: flex-end;
              a {
                display: flex;
                justify-content: center;
                flex-direction: column;
                .edit-btn {
                  background-color: #fadd1d;
                  border-radius: 15px;
                  width: 70px;
                  line-height: 25px;
                  height: 25px;
                  text-align: center;
                  span {
                    color: #333;
                  }
                }
              }
            }
          }
          .userinfo-bot {
            display: flex;
            .userinfo-bot-auto {
              text-align: center;
              padding: 10px 20px;
              .position {
                display: inline-block;
                width: 23px;
                height: 18px;
                background: url('../assets/mobile/position.png') no-repeat center center;
                background-size: 100%;
              }
              .company {
                display: inline-block;
                width: 20px;
                height: 18px;
                background: url('../assets/mobile/company.png') no-repeat center center;
                background-size: 100%;
              }
            }
            .line {
              display: flex;
              flex-direction: column;
              justify-content: center;
              i {
                display: inline-block;
                height: 32px;
                border-left: 1px solid #ccc;
              }
            }
          }
        }
        a.raw {
          display: flex;
          justify-content: space-between;
          .left {
            display: flex;
            .icon {
              height: 62px;
              overflow: hidden;
            }
            .title {
              font-size: 16px;
              color: #666;
              line-height: 60px;
              margin-left: 10px;
            }
          }
          .right {
            line-height: 60px;
          }
        }
      }
    }
    .perview-footer {
      position: fixed;
      z-index: 1;
      left: 0;
      bottom: 0;
      background-color: #fff;
      padding: 25px 16px;
      text-align: center;
      width: 100%;
      box-shadow: 0 0 10px #ccc;
      button {
        width: 100%;
        color: #333;
      }
    }
  }
}
</style>

