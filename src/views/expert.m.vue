<template>
  <div class="expert-m">
    <div class="expert-main-m">
      <div class="cards-search">
        <mt-search v-model="value" cancel-text="取消" placeholder="搜索"></mt-search>
        <div class="cards-skills">
          <div class="skills-list">
            <div class="skill-item" v-for="(s,index) in skills" :key="index" @click="chooseSkill(s.id)" :class="{'active': s.id === f}"><span>{{ s.name }}</span></div>
          </div>
        </div>
      </div>
      <div class="cards-list">
        <mt-loadmore :top-method="loadTop" ref="refresh">
          <div class="list" v-infinite-scroll="loadMore" infinite-scroll-immediate-check=true infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <div class="item" v-for="(item,index) in list" :key="index">
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
                <div class="btn">
                  <button @click="goConsult(item.id)">咨询</button>
                  <p><span>{{ '价格：'+item.price+'元' }}</span></p>
                </div>
              </div>
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
  const defaultImageUser = require('../assets/defaultuser.jpg');
  let timer;
  export default {
    name: 'exportM',
    data() {
      return {
        value: '',
        p: 1,
        l: 10,
        f: '',
        loading: false,
        list: [],
        skills: []
      }
    },
    mounted() {
      this.getMessage()
      this.getSkills()
    },
    watch: {
      'value'(val, oldval) {
        clearTimeout(timer);
        this.p = 1;
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
      getMessage() {
        this.$ajax('/expert/list', {
          params: {
            k: this.value,
            l: this.l,
            p: this.p,
            f: this.f
          }
        }).then(res => {
          if(res.data.result === 'success') {
            this.loading = false;
            let list = res.data.data.data;
            var arr = []
            for(let i = 0; i < list.length; i ++) {
              arr.push({
                id: list[i].user_id,
                img: list[i].avatar ? this.$getImageUrl(list[i].avatar, 50, 50) : defaultImageUser,
                name: list[i].name,
                position: list[i].company_position,
                company: list[i].company,
                skill: list[i].skill_name,
                price: list[i].ask_price
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
      getSkills() {
        this.$ajax('/expert/skill').then(res => {
          if(res.data.result === 'success') {
            let arr = [];
            arr.push({
              id: '',
              name: '全部'
            })
            for(let i = 0; i < res.data.data.length; i ++) {
              arr.push({
                id: res.data.data[i].id.toString(),
                name: res.data.data[i].name
              })
            }
            this.skills = arr;
          }
        }).catch(error => {

        })
      },
      chooseSkill(id) {
        this.f = id;
        this.p = 1;
        this.getMessage()
      },
      goConsult(id) {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userid');
        if(!token || !userid || userid == 'undefined' || token == 'undefined') {
          this.$router.push('/m/login')
        }else {
          this.$router.push({ path: '/m/expert/consult/'+id })
        }
      }
    }
  }
</script>

<style lang='less'>
.expert-m {
  min-height: 100%;
  width: 100%;
  background: #fff;
  .expert-main-m {
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
      .mint-search-list {
        display: none;
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
      .cards-skills {
        height: 36px;
        width: 100%;
        background: #f4f4f4;
        overflow-x: scroll;
        .skills-list {
          width: auto;
          white-space: nowrap;
        }
        .skill-item {
          line-height: 36px;
          display: inline-block;
          padding: 0 10px;
          margin: 0 10px;
        }
        .active {
          color: #333;
        }
      }
    }
    .cards-list {
      margin-top: 80px;
      background: #f4f4f4;
      .item {
        margin-bottom: 10px;
        background: #fff;
        padding: 0 10px;
        .mint-cell-swipe-button {
          line-height: 80px;
        }
      }
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
          justify-content: space-around;
          button {
            color: #333;
            background: #fadd1d;
            outline: none;
            border-radius: 15px;
            border: none;
            width: 70px;
            height: 24px;
          }
          p {
            margin: 5px 0;
            font-size: 12px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>

