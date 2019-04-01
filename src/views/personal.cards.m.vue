<template>
  <div class="personal-cards-m">
    <div class="personal-cards-main">
      <div class="cards-search">
        <mt-search v-model="value" cancel-text="取消" placeholder="搜索"></mt-search>
      </div>
      <div class="cards-list">
        <mt-loadmore :top-method="loadTop" ref="refresh">
          <div class="list" v-infinite-scroll="loadMore" infinite-scroll-immediate-check=true infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <div class="item" v-for="(item,index) in list" :key="index">
              <mt-cell-swipe
                title=""
                :right="[
                  {
                    content: '删除',
                    style: { background: '#ccc', color: '#fff' },
                    handler: () => deleteItem(item.id)
                  }
                ]">
                  <div class="card-item">
                    <div class="text">
                      <div class="avatar-box">
                        <div class="avatar" :style="{ 'background-image': 'url('+item.img+')' }" @click="gocard(item.id)"></div>
                      </div>
                      <div class="msg" @click="gocard(item.id)">
                        <h4><strong>{{ item.name }}</strong></h4>
                        <p><span>{{ item.skill }}</span><span>{{ item.position }}</span></p>
                        <p><span>{{ item.company }}</span></p>
                      </div>
                    </div>
                    <div class="btn"><button @click="ask(item.id)">咨询</button></div>
                  </div>
                </mt-cell-swipe>
            </div>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
  import { Search } from 'mint-ui';
  import Vue from 'vue';
  Vue.component(Search.name, Search);
  import { CellSwipe } from 'mint-ui';
  Vue.component(CellSwipe.name, CellSwipe);
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  const defaultImageUser = require('../assets/defaultuser.jpg');
  let timer;
  export default {
    name: 'personalCardsM',
    data() {
      return {
        value: '',
        p: 1,
        l: 10,
        loading: false,
        list: []
      }
    },
    mounted() {
      this.getMessage()
    },
    watch: {
      'value'(val, oldval) {
        clearTimeout(timer);
        let _this = this;
        timer = setTimeout(() => {
          _this.getMessage()
        }, 300)
      }
    },
    methods: {
      loadMore() {
        this.loading = true;
        this.p += 1;
        this.getMessage()
      },
      loadTop() {
        this.p = 1;
        this.getMessage();
      },
      deleteItem(id) {
        MessageBox.confirm('确定执行此操作?').then(action => {
          this.$ajax.post('/user/follow', {
            follow_user_id: id,
            t: 'cancel',
            user_id: localStorage.getItem('userid'),
            token: localStorage.getItem('token')
          }).then(res => {
            if(res.data.result === 'success') {
              Toast('删除成功！');
              this.getMessage();
            }
          })
        }).catch(action => {

        });
      },
      getMessage() {
        this.$ajax('/user/myfollow', {
          params: {
            user_id: localStorage.getItem('userid'),
            token: localStorage.getItem('token'),
            k: this.value,
            l: this.l,
            p: this.p
          }
        }).then(res => {
          if(res.data.result === 'success') {
            this.loading = false;
            let list = res.data.data.data;
            var arr = []
            for(let i = 0; i < list.length; i ++) {
              arr.push({
                id: list[i].attention_user_id,
                img: list[i].avatar ? this.$getImageUrl(list[i].avatar, 50, 50) : defaultImageUser,
                name: list[i].name,
                position: list[i].company_position,
                company: list[i].company,
                skill: list[i].skill_name
              })
            }
            if(this.p === 1) {
              this.list = arr;
            }else {
              this.list = this.list.concat(arr);
            }
            let _this = this;
            setTimeout(() => {
              _this.$refs.refresh.onTopLoaded();
            },1500)
          }
        }).catch(error => {

        })
      },
      gocard(id) {
        this.$router.push({ path: '/m/personal/card/'+id })
      },
      ask(id) {
        this.$router.push({ path: '/m/expert/consult/'+id })
      }
    }
  }
</script>

<style lang='less'>
.personal-cards-m {
  min-height: 100%;
  width: 100%;
  background: #fff;
  .personal-cards-main {
    position: relative;
    background: #fff;
    .cards-search {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      .mint-search {
        height: auto;
      }
      .mint-searchbar {
        background: #fff;
        .mint-searchbar-inner {
          background: #f4f4f4;
          border-radius: 4px;
          .mint-searchbar-core {
            background: #f4f4f4;
          }
        }
      }
    }
    .cards-list {
      margin-top: 44px;
      background: #f4f4f4;
      .item {
        margin-bottom: 10px;
        .mint-cell-swipe-button {
          line-height: 80px;
        }
      }
      .mint-cell-wrapper {
        .mint-cell-title {
          display: none;
        }
        .mint-cell-value {
          flex-grow: 1;
          .card-item {
            display: flex;
            width: 100%;
            justify-content: space-between;
            padding: 10px 0;
            .text {
              display: flex;
              .avatar-box {
                display: flex;
                flex-direction: column;
                justify-content: center;
              }
              .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow: hidden;
                background-repeat: no-repeat;
                background-size: cover;
              }
              .msg {
                margin-left: 10px;
                p {
                  margin: 5px 0;
                  font-size: 14px;
                  span {
                    margin-right: 10px;
                  }
                }
                h4 {
                  color: #333;
                }
              }
            }
            .btn {
              display: flex;
              flex-direction: column;
              justify-content: center;
              button {
                color: #333;
                background: #fadd1d;
                outline: none;
                border-radius: 15px;
                border: none;
                width: 70px;
                height: 24px;
              }
            }
          }
        }
      }
    }
  }
}
</style>

