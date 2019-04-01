<template>
  <div class="vote-detail-m">
    <div class="body">
      <div class="title">
        <h2><span>{{ title }}</span></h2>
        <p><span>{{ '作品编号：'+num }}</span><span>{{ '作者：'+auth }}</span></p>
      </div>
      <div class="content">
        <p><span>{{ desc }}</span></p>
        <div class="image"><img :src="img" alt=""></div>
      </div>
    </div>
    <div class="foot">
      <button :class="{'active': !isVote, 'auto': isVote}" @click.prevent="!isVote && vote()">{{ btnText }}</button>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  export default {
    name: 'voteDetailM',
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
        width: document.documentElement.clientWidth,
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
            this.img = this.$getImageUrl(res.data.data.item_pic, this.width, this.width),
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
          this.$router.push('/m/login');
          return false;
        }else {
          MessageBox.confirm('确定为TA投票?').then(action => {
            this.$ajax.post('/vote/submit', {
              id: this.id,
              user_id: this.userid,
              token: this.token
            }).then(res => {
              if(res.data.result === 'success') {
                Toast('恭喜您投票成功！');
                this.getMessage()
              }else {
                if(res.data.data.errno=="-10002") {
                  this.$router.push('/m/login')
                }else {
                  Toast(res.data.data.errmsg);
                }
              }
            }).catch(error => {

            })
          }).catch(error => {

          })

        }
      }
    }
  }
</script>

<style lang='less'>
.vote-detail-m {
  height: 100%;
  position: relative;
  background: #fff;
  .foot {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0 0 10px #ccc;
    button {
      width: 100%;
      height: 50px;
      outline: none;
      border: none;
      &.active {
        background: #fadd1d;
      }
      &.auto {
        background: #ccc;
      }
    }
  }
  .body {
    background: #fff;
    margin-bottom: 50px;
    .title {
      padding: 10px;
      border-bottom: 1px solid #eee;
      h2 {
        color: #333;
      }
      p {
        span:first-child {
          border-right: 1px solid #ccc;
          padding-left: 0px;
        }
        span {
          padding: 0 10px;
        }
      }
    }
    .content {
      padding: 10px;
      .image {
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
