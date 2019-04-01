<template>
  <div class="activity-m">
    <div class="content">
      <mt-loadmore :top-method="loadTop" ref="refresh">
        <div class="list" v-infinite-scroll="loadMore" infinite-scroll-immediate-check=true infinite-scroll-disabled="loading" infinite-scroll-distance="10">
          <div class="item" v-for="(item,index) in list" :key="index">
            <router-link :to="'/m/activity/'+item.id">
              <div class="image"><img :src="item.img" alt=""></div>
              <div class="text"><h4><strong>{{ item.title }}</strong></h4></div>
            </router-link>
          </div>
        </div>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
  const defaultImageList = require('../assets/defaultclasses.jpg')
  import axios from 'axios'
  export default {
    name: 'activityM',
    data() {
      return {
        list: [],
        arr_list: [],
        p: 1,
        l: 10,
        loading: false,
        width: document.documentElement.clientWidth
      }
    },
    mounted() {
      this.getMessage()
    },
    methods: {
      getMessage() {
        axios.all([this.$ajax.get('/activitys/list', {
          params: {
            l: this.l,
            p: this.p
          }
        }), this.$ajax('/activitys/banner')]).then(axios.spread((res, banner) => {
          this.loading = false;
          let arr_banner = [], arr_list = [];
          if(banner.data.result === 'success') {
            let list = banner.data.data;
            let arr = [];
            for(let i = 0; i < list.length; i ++) {
              arr.push({
                img: list[i].event_banner ? this.$getImageUrl(list[i].event_banner, this.width, parseInt(this.width*2/3)) : defaultImageList,
                title: list[i].event_title,
                id: list[i].id
              })
            }
            arr_banner = arr;
          }
          if(res.data.result === 'success') {
            let list = res.data.data.data;
            let arr = [];
            for(let i = 0; i < list.length; i ++) {
              arr.push({
                img: list[i].event_image ? this.$getImageUrl(list[i].event_image,this.width,parseInt(this.width*2/3)) : defaultImageList,
                title: list[i].event_title,
                id: list[i].id
              })
            }
            if(this.p === 1) {
              arr_list = arr;
            }else {
              arr_list = this.arr_list.concat(arr);
            }
            this.list = arr_banner.concat(arr_list);
            let _this = this;
            setTimeout(() => {
              _this.$refs.refresh.onTopLoaded();
            },500)
          }
        })).catch(error => {

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
      }
    }
  }
</script>

<style lang='less'>
.activity-m {
  height: 100%;
  background: #fff;
  .content {
    padding: 15px;
    background: #fff;
    .list {
      .item {
        .image {
          text-align: center;
          border-radius: 10px;
          overflow: hidden;
          img {
            max-width: 100%;
          }
        }
        .text {
          line-height: 36px;
          color: #333;
          font-size: 14px;
          border-bottom: 1px solid #e5e5e5;
          margin-bottom: 15px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }
  }
}
</style>

