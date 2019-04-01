<template>
  <div class="vote">
    <div class="banner">
      <div class="content">
        <img src="../assets/bann.jpg" alt="">
        <p>每天每个账号可投3票，<span>还剩 {{ chance }} 票</span>！</p>
      </div>
    </div>
    <div class="list">
      <div class="content">
        <div class="item" v-for="(item,index) in list" :key="index">
          <div class="item-top">
            <div class="image">
              <imageBox :link="'/vote/'+item.id" :w="330" :h="250" :src="item.img" :t="'cover'" />
              <!-- <router-link :to="'/vote/'+item.id"><img :src="item.img" alt=""></router-link> -->
            </div>
          </div>
          <div class="item-bottom">
            <h4><strong>{{ item.name }}</strong></h4>
            <p><span>{{ '作品编号：'+item.num }}</span><span class="name">{{ '作者：'+item.auth }}</span></p>
            <div class="renderer">
              <span class="num">{{ item.vote+'票' }}</span>
              <button  :class="{'active': !item.isVote}" @click.prevent="!item.isVote && vote(item.id)"><span>{{ item.btnText }}</span></button>
            </div>
          </div>
        </div>
      </div>
      <div class="list-page" v-if="list.length > 16">
        <el-pagination background layout="prev, pager, next" :total="total" :page-size="size"
        :current-page="current" @current-change="changePage"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import imageBox from '@/components/imageBox';
  export default {
    name: 'vote',
    data() {
      return {
        list: [],
        l: 16,
        p: 1,
        userid: '',
        token: '',
        chance: 0,
        total: 0,
        size: 1,
        current: 1,
      }
    },
    components: {
      imageBox
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
      this.getChance()
      this.getMessage()
      this.$NProgress.done()
    },
    methods: {
      getMessage() {
        this.$ajax('/vote/list', { params: {
          l: this.l,
          p: this.p,
          user_id: this.userid,
          token: this.token
        } }).then(res => {
          if(res.data.result === 'success') {
            let data = res.data.data.data;
            let arr = [];
            for(let i = 0; i < data.length; i ++) {
              arr.push({
                id: data[i].id,
                name: data[i].item_name,
                desc: data[i].item_desc,
                img: data[i].item_pic,
                num: data[i].item_no,
                auth: data[i].item_author,
                vote: data[i].vote_num,
                isVote: data[i].is_vote > 0 ? true : false,
                btnText: data[i].is_vote > 0 ? '已投票' : '为TA投票'
              })
            }
            this.list = [...arr];
            this.current = res.data.data.current_page;
            this.total = res.data.data.last_page;
          }
        }).catch(error => {

        })
      },
      getChance() {
        this.$ajax('/vote/usernum', {
          params: {
            user_id: this.userid,
            token: this.token
          }
        }).then(res => {
          if(res.data.result === 'success') {
            this.chance = res.data.data;
          }
        }).catch(error => {

        })
      },
      vote(id) {
        if(!this.userid || !this.token || this.userid == 'undefined' || this.token == 'undefined') {
          this.$router.push('/login');
          return false;
        }else {
          this.$confirm('确定为TA投票?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$ajax.post('/vote/submit', {
              id: id,
              user_id: this.userid,
              token: this.token
            }).then(res => {
              if(res.data.result === 'success') {
                this.$message({
                  type: 'success',
                  message: '恭喜您投票成功！'
                });
                this.getMessage()
                this.getChance()
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
      },
      changePage(val) {
        this.current = val;
        this.p = val;
        this.getMessage()
      }
    }
  }
</script>

<style lang='less'>
.vote {
  .banner {
    background: #fff;
    .content {
      @media screen and ( min-width: 1380px ) {
        width: 1380px;
      }
      @media screen and ( max-width: 1380px ) {
        width: 1200px;
      }
      margin: 0 auto;
      padding-top: 30px;
      img {
        max-width: 100%;
      }
      p {
        margin: 0;
        line-height: 50px;
        text-align: center;
        span {
          color: #ff9000;
        }
      }
    }
  }
  .list {
    .content {
      @media screen and ( min-width: 1380px ) {
        width: 1380px;
      }
      @media screen and ( max-width: 1380px ) {
        width: 1200px;
      }
      margin: 0 auto;
      padding: 20px 0;
      .item {
        display: inline-block;
        background: #fff;
        border-radius: 4px;
        overflow: hidden;
        width: 330px;
        margin-bottom: 20px;
        @media screen and ( min-width: 1380px ) {
          margin-right: 20px;
          &:nth-child(4n) {
            margin-right: 0;
          }
        }
        @media screen and ( max-width: 1380px ) {
          margin-right: 105px;
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
        .item-top {
          height: 250px;
          overflow: hidden;
          .image {
            text-align: center;
            a {
              display: flex;
            }
          }
        }
        .item-bottom {
          height: 120px;
          overflow: hidden;
          padding: 0 15px;
          h4 {
            color: #333;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            line-height: 40px;
          }
          p {
            line-height: 24px;
            font-size: 12px;
            margin: 0;
            span {
              padding: 0 10px;
              &:first-child {
                padding-left: 0;
                border-right: 1px solid #ccc;
              }
            }
          }
          .renderer {
            line-height: 38px;
            display: flex;
            justify-content: space-between;
            .num {
              color: #ff9000;
            }
            button {
              outline: none;
              border: none;
              color: #333;
              background-color: #ccc;
              width: 126px;
              border-radius: 36px;
              cursor: pointer;
              &.active {
                background-color: #fed900;
                span {
                  display: inline-block;
                  background: url('../assets/zan.png') no-repeat left center;
                  background-size: 16px;
                  padding-left: 18px;
                }
              }
            }
          }
        }
      }
    }
    .list-page {
      margin-bottom: 40px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>

