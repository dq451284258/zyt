<template>
  <div class="personal-consult-m">
    <div class="personal-consult-main-m">
      <div class="tab-head">
        <div class="tab-head-item left" :class="{'active': tabActive === '1'}" @click="tab('1')">
          <button>未回答</button>
        </div>
        <div class="tab-head-item right" :class="{'active': tabActive === '2'}" @click="tab('2')">
          <button>已回答</button>
        </div>
      </div>
      <div class="tab-list">
        <mt-loadmore :top-method="loadTop" ref="refresh">
          <div class="tab-list-ul" v-infinite-scroll="loadMore" infinite-scroll-immediate-check=true infinite-scroll-disabled="loading" infinite-scroll-distance="50">
            <div class="tab-list-li" v-for="(a, index) in list" :key="index">
              <div class="text" @click="goanswer(a.id, a.name, a.time)">
                <div class="p"><span>向</span><span class="name" @click.stop="gocard(a.userid)">{{ a.name }}</span><span>提出问题</span></div>
                <h3><strong>{{ a.title }}</strong></h3>
                <div class="p"><span>{{ a.desc }}</span></div>
                <div class="p"><span>{{ '咨询时间：'+a.time }}</span></div>
              </div>
              <!-- <div class="btn" v-show="tabActive === '1'"><button @click="goanswer(a.id, a.name, a.time)">解答</button></div> -->
            </div>
          </div>
        </mt-loadmore>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue';
  import { TabContainer, TabContainerItem } from 'mint-ui';
  Vue.component(TabContainer.name, TabContainer);
  Vue.component(TabContainerItem.name, TabContainerItem);
  export default {
    name: 'personalAnswerM',
    data() {
      return {
        tabActive: '1',
        t: 'ask_wait',
        l: 10,
        p: 1,
        list: [],
        loading: false
      }
    },
    mounted() {
      this.getMessage()
    },
    methods: {
      getMessage() {
        this.$ajax('/user/myquestion', {
          params: {
            user_id: localStorage.getItem('userid'),
            token: localStorage.getItem('token'),
            k: '',
            t: this.t,
            l: this.l,
            p: this.p
          }
        }).then(res => {
          if(res.data.result === 'success') {
            this.loading = false;
            let list = res.data.data.data;
            let arr = [];
            for(let i = 0; i < list.length; i ++) {
              arr.push({
                name: list[i].answer_user_name,
                title: list[i].ask_title,
                desc: list[i].ask_description,
                time: list[i].create_time,
                id: list[i].id,
                userid: list[i].answer_user_id
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
      loadMore() {
        this.loading = true;
        this.p += 1;
        this.getMessage()
      },
      loadTop() {
        this.p = 1;
        this.getMessage();
      },
      tab(type) {
        if(type === '1') {
          this.tabActive = '1';
          this.p = 1;
          this.t = 'ask_wait';
          this.getMessage()
        }else {
          this.tabActive = '2';
          this.p = 1;
          this.t = 'ask_answer';
          this.getMessage()
        }
      },
      goanswer(id, name, time) {
        this.$router.push('/m/personal/consult/'+id+'?name='+name+'&time='+time)
      },
      gocard(id) {
        this.$router.push('/m/personal/card/'+id)
      }
    }
  }
</script>

<style lang='less'>
.personal-consult-m {
  background: #fff;
  width: 100%;
  height: 100%;
  .personal-consult-main-m {
    position: relative;
    .tab-head {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 15px 0;
      display: flex;
      background: #fff;
      .tab-head-item {
        width: 50%;
        button {
          outline: none;
          border: none;
          font-size: 14px;
          height: 30px;
          width: 110px;
          color: #666;
          background: #f0f0f0;
          transition: all 0.15s;
        }
      }
      .left {
        text-align: right;
        button {
          border-top-left-radius: 30px;
          border-bottom-left-radius: 30px;
        }
      }
      .right {
        button {
          border-top-right-radius: 30px;
          border-bottom-right-radius: 30px;
        }
      }
      .active {
        button {
          background: #fadd1d;
          color: #333;
        }
      }
    }
    .tab-list {
      margin-top: 60px;
      .tab-list-li {
        border-top: 1px solid #eee;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        width: 100%;
        background: #fff;
        .text {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          width: 0;
          .p {
            margin: 5px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .name {
              color: #ff9933;
            }
          }
          h3 {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #333;
          }
        }
        .btn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          button {
            width: 70px;
            height: 26px;
            color: #333;
            border: none;
            outline: none;
            border-radius: 26px;
            background: #fadd1d;
          }
        }
      }
    }
  }
}
</style>

