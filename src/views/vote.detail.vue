<template>
  <div class="vote-detail" :style="{'min-height': mainHeight}">
    <div class="vote-detail-main">
      <div class="content">
        <div class="banner"><img src="../assets/bann.jpg" ></div>
        <div class="header">
          <div class="header-render">
            <div class="left">
              <h2><strong>{{ title }}</strong></h2>
              <p><span>作者 {{ auth }}</span><span>作品编号 {{ num }}</span></p>
            </div>
            <div class="right">
              <span class="num">{{ votenum }}票</span>
              <button :class="{'active': !isVote}" @click.prevent="!isVote && vote()"><span>{{ btnText }}</span></button>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="desc">
            <p v-html="desc"></p>
          </div>
          <div class="image">
            <img :src="img" alt="">
          </div>
          <div class="btn">
            <button :class="{'active': !isVote}" @click.prevent="!isVote && vote()"><span>{{ btnText }}</span></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'voteDetail',
  props: ['mainHeight'],
  data() {
      return {
        title: '',
        num: '',
        auth: '',
        desc: '',
        img: '',
        btnText: '',
        isVote: true,
        id: '',
        votenum: 0,
        userid: '',
        token: ''
      }
    },
    mounted() {
      let userid = localStorage.getItem('userid');
      let token = localStorage.getItem('token');
      if(!userid || userid == 'undefined') {
        userid = ''
      }
      if(!token || token == 'undefined') {
        token = ''
      }
      this.userid = userid;
      this.token = token;
      this.getMessage()
      this.$NProgress.done()
    },
    methods: {
      getMessage() {
        this.$ajax('/vote/detail/'+this.$route.params.id, {params: {
          user_id: this.userid,
          token: this.token
        }}).then(res => {
          if(res.data.result === 'success') {
            this.title = res.data.data.item_name,
            this.id = res.data.data.id,
            this.desc = res.data.data.item_desc,
            this.img = this.$getImageUrl(res.data.data.item_pic, 1200, 1200),
            this.num = res.data.data.item_no,
            this.auth = res.data.data.item_author,
            this.votenum = res.data.data.vote_num,
            this.isVote = res.data.data.is_vote > 0 ? true : false,
            this.btnText = res.data.data.is_vote > 0 ? '已投票' : '为TA投票'
          }
        })
      },
      vote() {
        if(!this.userid || !this.token || this.userid == 'undefined' || this.token == 'undefined') {
          this.$router.push('/login');
          return false;
        }else {
          this.$confirm('确定为TA投票?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$ajax.post('/vote/submit', {
              id: this.id,
              user_id: this.userid,
              token: this.token
            }).then(res => {
              if(res.data.result === 'success') {
                this.$message({
                  type: 'success',
                  message: '恭喜您投票成功！'
                });
                this.getMessage()
              }else {
                if(res.data.data.errno=="-10002") {
                  this.$router.push('/login')
                }else {
                  this.$message({message: res.data.data.errmsg});
                }
              }
            }).catch(error => {

            })
          }).catch(() => {

          });
        }
      }
    }
}
</script>

<style lang='less'>
.vote-detail {
  background: #fff;
  .vote-detail-main {
    .content {
      @media screen and ( min-width: 1380px ) {
        width: 1380px;
      }
      @media screen and ( max-width: 1380px ) {
        width: 1200px;
      }
      margin: 0 auto;
      .banner {
        padding-top: 30px;
        img {
          max-width: 100%;
        }
      }
      .header {
        .header-render {
          display: flex;
          justify-content: space-between;
          padding: 40px 0;
          border-bottom: 1px solid #eee;
          .left {
            h2 {
              color: #333;
            }
            p {
              margin: 10px 0 0 0;
              span {
                padding: 0 20px;
                &:first-child {
                  padding-left: 0;
                  border-right: 1px solid #ccc;
                }
              }
            }
          }
          .right {
            .num {
              color: #ff9000;
              font-weight: bold;
              font-size: 16px;
              margin-right: 20px;
            }
            button {
              width: 260px;
              height: 50px;
              border: none;
              outline: none;
              cursor: pointer;
              border-radius: 2px;
              transition: all 0.15s;
              &.active {
                background-color: #fed900;
                &:active {
                  background-color: #f9e571;
                }
                span {
                  display: inline-block;
                  background: url('../assets/zan.png') no-repeat left center;
                  background-size: 16px;
                  padding-left: 20px;
                }
              }
            }
          }
        }
      }
      .body {
        .desc {
          width: 700px;
          margin: 0 auto;
          text-align: center;
          padding: 40px 0;
        }
        .image {
          text-align: center;
          img {
            max-width: 100%;
          }
        }
        .btn {
          padding: 70px 0;
          text-align: center;
          button {
            width: 700px;
            height: 78px;
            border: none;
            outline: none;
            cursor: pointer;
            border-radius: 2px;
            transition: all 0.15s;
            &.active {
              background-color: #fed900;
              &:active {
                background-color: #f9e571;
              }
              span {
                display: inline-block;
                background: url('../assets/zan.png') no-repeat left center;
                background-size: 16px;
                padding-left: 20px;
              }
            }
          }
        }
      }
    }
  }
}
</style>

