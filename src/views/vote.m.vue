<template>
  <div class="vote-m">
    <div class="vote-main-m">
      <mt-loadmore :top-method="loadTop" ref="refresh">
        <div class="list" v-infinite-scroll="loadMore" infinite-scroll-immediate-check=true infinite-scroll-disabled="loading" infinite-scroll-distance="50">
          <div class="item" v-for="(item,index) in list" :key="index">
            <div class="title">
              <router-link :to="'/m/vote/'+item.id">
                <h2><span>{{ item.name }}</span></h2>
                <p><span>{{ item.desc }}</span></p>
              </router-link>
            </div>
            <div class="content">
              <div class="image"><router-link :to="'/m/vote/'+item.id"><img :src="item.img" alt=""></router-link></div>
              <p><span>{{ '作品编号：'+item.num }}</span></p>
              <div class="p">
                <span class="name">{{ '作者：'+item.auth }}</span>
                <label for=""><span class="num">{{ item.vote+'票' }}</span><button :class="{'active': !item.isVote}" @click.prevent="!item.isVote && vote(item.id)">{{ item.btnText }}</button></label>
              </div>
            </div>
          </div>
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  export default {
    name: 'voteM',
    data() {
      return {
        list: [],
        l: 10,
        p: 1,
        loading: false,
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
                img: this.$getImageUrl(data[i].item_pic, this.width, this.width),
                num: data[i].item_no,
                auth: data[i].item_author,
                vote: data[i].vote_num,
                isVote: data[i].is_vote > 0 ? true : false,
                btnText: data[i].is_vote > 0 ? '已投票' : '为TA投票'
              })
            }
            if(this.p === 1) {
              this.list = [...arr];
            }else {
              this.list = this.list.concat(arr);
            }
          }
          setTimeout(() => {
            this.$refs.refresh.onTopLoaded();
          },300)
        }).catch(error => {

        })
      },
      loadMore() {
        this.loading = true;
        this.p += 1;
        this.getMessage()
      },
      loadTop() {
        this.p = 1;
        this.getMessage();
      },
      vote(id) {
        if(!this.userid || !this.token || this.userid == 'undefined' || this.token == 'undefined') {
          this.$router.push('/m/login');
          return false;
        }else {
          MessageBox.confirm('确定为TA投票?').then(action => {
            this.$ajax.post('/vote/submit', {
              id: id,
              user_id: this.userid,
              token: this.token
            }).then(res => {
              if(res.data.result === 'success') {
                Toast('恭喜您投票成功！');
                this.loadTop()
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
.vote-m {
  height: 100%;
  .vote-main-m {
    min-height: 100%;
    .list {
      .item {
        background: white;
        margin-bottom: 10px;
        .title {
          padding: 10px;
          border-bottom: 1px solid #eee;
          h2 {
            color: #333;
          }
        }
        .content {
          padding: 10px;
          .image {
            text-align: center;
            img {
              max-width: 100%;
            }
          }
          .p {
            display: flex;
            justify-content: space-between;
            .name {
              color: #999;
            }
            label {
              .num {
                color: #ff9000;
                margin-right: 20px;
              }
              button {
                width: 100px;
                height: 26px;
                border-radius: 26px;
                outline: none;
                border: none;
                background: #eee;
                &.active {
                  background: #fadd1d;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

