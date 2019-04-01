<template>
  <div class="train-main" v-show="pageReady">
    <div class="app-head">
      <div class="app-head-train">
        <div class="banner-area">
          <router-link :to="banner.link">
            <img :src="banner.url" alt="">
          </router-link>
        </div>
        <div class="head-tab-render">
          <div class="tab-render-title">
            <div class="tab-render-title-h">
              <h3><span>课程列表</span></h3>
            </div>
            <div class="tab-render-search">
              <el-input placeholder="请输入关键字" class="input-with-select" v-model="params.k" @keyup.enter.native='search'>
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div>
          </div>
          <div class="tab-render-filter" v-if="typeFilters.length">
            <div class="filter-lists" v-for="(tf,index) in typeFilters" :key="index">
              <div class="filter-lists-type"><h4><span v-text="tf.name"></span></h4></div>
              <div class="filter-lists-all" @click="chooseFilters('',index)"><span :class="{'active':tf.active}" v-text="tf.all"></span></div>
              <div class="filter-lists-items">
                <ul>
                  <li v-for="(list,tindex) in tf.list" :key="tindex" :class="{'active':list.active}" @click="chooseFilters(tindex,index)">
                    <span v-text="list.item"></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="app-list">
      <div class="app-list-content">
        <div class="app-list-left">
          <div class="app-list-head-left">
            <h3><span>课程精选</span></h3>
          </div>
          <div class="app-list-render">
            <div class="app-list-render-li" v-for="(n,index) in selectedList" :key="index">
              <div class="app-list-item-img">
                <router-link :to="'/train/'+n.id"><img :src="n.img" alt="" width="228"></router-link>
              </div>
              <div class="app-list-item-content">
                <h4><span :title="n.name">{{ n.name }}</span></h4>
                <div class="app-list-item-content-render">
                  <span>{{ n.user }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="app-list-right">
          <div class="app-list-head-right">
            <h3><span>全部课程</span></h3>
            <div class="app-list-head-tabs">
                <el-tabs @tab-click="handleClick" v-model="params.o">
                  <el-tab-pane label="最新" name="new">最新</el-tab-pane>
                  <el-tab-pane label="销量" name="sales">销量</el-tab-pane>
                  <el-tab-pane label="价格" name="price">价格</el-tab-pane>
                </el-tabs>
            </div>
            <div class="app-list-head-tabs-empty"></div>
          </div>
          <div class="app-list-render">
            <div class="app-list-render-li" v-for="(item,index) in pageData.list" :key="index">
              <div class="app-list-item-img">
                <router-link :to="'/train/'+item.id"><img :src="item.img" alt="" width="260"></router-link>
              </div>
              <div class="app-list-item-content">
                <div class="app-list-item-content-render">
                  <h4><router-link :to="'/train/'+item.id"><span :title="item.name">{{ item.name }}</span></router-link></h4>
                  <div class="p1"><span>{{ item.position }}</span><div><span class="ori" v-if="item.oriprice">{{ '￥'+item.oriprice }}</span><span class="money">{{ '￥'+item.price }}</span></div></div>
                  <div class="p2">
                    <div><span class="look">{{ item.look }}</span><span class="number">{{ item.comment }}</span></div>
                  </div>
                </div>
                <div class="app-list-item-user">
                  <router-link :to="{path:'/expert/information',query:{id:item.userid}}" v-if="item.isexpert">
                    <div class="app-list-item-user-photo"><img :src="item.userimg" alt=""></div>
                    <div class="app-list-item-user-name">{{ item.user }}</div>
                  </router-link>
                  <router-link to='' v-else>
                    <div class="app-list-item-user-photo"><img :src="item.userimg" alt=""></div>
                    <div class="app-list-item-user-name">{{ item.user }}</div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
          <div class="app-list-page">
            <el-pagination background layout="prev, pager, next" :total="pageData.total" :page-size="pageData.size"
            :current-page="pageData.current" @current-change="changePage"></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const defaultImageList = require('../assets/defaultclasses.jpg')
const defaultImageUser = require('../assets/defaultuser.jpg')
export default {
  name: 'train',
  data () {
    return {
      banner: {
        link: '/train',
        url: require('../assets/bann.jpg')
      },
      searchValue: '',
      typeFilters: [{
        name: '课程类型',
        list: [{ item: '线上课程',active: false,id:1 },{ item: '线下课程',active: false,id:2 }],
        all: '全部',
        active: true
      },{
        name: '专业',
        list: [],
        all: '全部',
        active: true
      }],
      typeFiltersValue: [],
      pageReady: false,
      selectedList: [],
      pageData: {
        current: 1,
        list: [],
        total: 1,
        size: 1
      },
      params: {
        l: 12,
        p: 1,
        k: '',
        c: 0,
        f: '',
        o: 'new',
        s: 'desc'
      },
      handleTabName: 'new'
    }
  },
  mounted () {
    this.getMessage()
  },
  methods: {
    getMessage() {
      axios.all([this.$ajax('/course/prof'),this.$ajax('/course/recom?l=5'),this.$ajax('/course/list?l=12')]).then(axios.spread((filter, selected,all) => {
        this.getFilterList(filter.data);
        this.getListSelected(selected.data);
        this.getListAll(all.data);
        this.$NProgress.done();
        this.pageReady = true;
      })).catch(axios.spread((filter, selected,all) => {
        // console.log('filter:' + filter + 'selected:' + selected + 'all:' + all)
      }))
    },
    handleClick(tab, event) {
      // console.log(tab)
      this.pageData.current = 1;
      this.params.p = 1;
      if(tab.name === this.handleTabName) {
        this.params.s = this.params.s === 'desc' ? 'asc' : 'desc';
      }else {
        this.params.s = 'desc';
      }
      this.handleTabName = tab.name;
      this.params.o = tab.name;
      this.getList()
    },
    search() {
      this.chooseFilters('',0);
      this.chooseFilters('',1);
      this.pageData.current = 1;
      this.params.p = 1;
      this.params.o = 'new';
      this.getList()
    },
    changePage(val) {
      this.pageData.current = val;
      this.params.p = val;
      this.getList()
    },
    getList() {
      this.$ajax('/course/list',{
        params: this.params
      }).then((res) => {
        this.getListAll(res.data)
      }).catch((error) => {
        console.log(error)
      })
    },
    getListSelected(res) {
      // console.log(res)
      let list = res.data;
      let li = {},arr = [];
      for(let i = 0;i < list.length;i ++) {
        li = {
          img: list[i].classes_img ? this.$getImageUrl(list[i].classes_img,228,152) : defaultImageList,
          name: list[i].classes_title,
          id: list[i].id,
          user: list[i].professor
        }
        arr.push(li);
      }
      this.selectedList = arr;
    },
    getListAll(res) {
      // console.log(res)
      let list = res.data.data;
      let li = {},arr = [];
      for(let i = 0;i < list.length;i ++) {
        li = {
          img: list[i].classes_img ? this.$getImageUrl(list[i].classes_img,260,196) : defaultImageList,
          name: list[i].classes_title,
          id: list[i].id,
          user: list[i].professor,
          position: list[i].classes_cate_name,
          look: list[i].buy_num,
          comment: list[i].comment_count,
          price: list[i].classes_price,
          userid: list[i].professor_id,
          userimg: list[i].avatar ? this.$imageHost+list[i].avatar : defaultImageUser,
          isexpert: list[i].is_professor > 0 ? true : false,
          oriprice: list[i].original_price ? list[i].original_price : list[i].classes_price
        }
        arr.push(li);
      }
      this.pageData.list = arr;
      this.pageData.current = res.data.current_page;
      this.pageData.total = res.data.last_page;
    },
    getFilterList(res) {
      // console.log(res)
      let list = res.data;
      let li = {},arr = [];
      for(let i = 0;i < list.length;i ++) {
        li = {
          item: list[i].classes_cate_name,
          id: list[i].id,
          active: false
        }
        arr.push(li);
      }
      this.typeFilters[1].list = arr;
    },
    chooseFilters(tindex,index) {
      if(tindex === '') {
        let list = this.typeFilters[index].list;
        for (let i = 0;i < list.length;i ++) {
          list[i].active = false;
        }
        this.typeFilters[index].active = true;
      }else {
        this.typeFilters[index].active = false;
        this.typeFilters[index].list[tindex].active = !this.typeFilters[index].list[tindex].active;
      }
      let item = '',item_li = '',item_arr = [],item_li_arr = '',item_li_arr_t = '';
      for(let i = 0;i < this.typeFilters.length;i ++) {
        if(this.typeFilters[i].active) {
          if(i === 0){
            item = {id: 0}
          }else {
            item = {id: ''}
          }
          item_arr.push(item);
        }else{
          for(let n = 0;n < this.typeFilters[i].list.length;n ++){
            if(this.typeFilters[i].list[n].active){
              item_li = this.typeFilters[i].list[n].id;
              item_li_arr = item_li_arr+ '|' + item_li;
            }
          }
          if(item_li_arr.split('|').length && item_li_arr.split('|').length > 2) {
            if(i === 0) {
              item = {id: 0}
            }else {
              for(let t = 0;t < item_li_arr.split('|').length;t ++){
                if(t === 0){
                  item_li_arr_t = item_li_arr_t;
                }else if(t === 1){
                  item_li_arr_t = item_li_arr_t + item_li_arr.split('|')[t]
                }else {
                  item_li_arr_t = item_li_arr_t + '|' + item_li_arr.split('|')[t]
                }
              }
              item = {id: item_li_arr_t};
              item_li_arr_t = '';
            }
          }else if(item_li_arr.split('|').length && item_li_arr.split('|').length === 2){
            if(i === 0) {
              item = {id:parseInt(item_li_arr.split('|')[1])}
            }else {
              item = {id:item_li_arr.split('|')[1]}
            }
          }else{
            if(i === 0) {
              item = {id:0}
            }else {
              item = {id:''}
            }
          }
          item_li_arr = [];
          item_arr.push(item);
        }
      }
      this.typeFiltersValue = item_arr;
      this.params.c = this.typeFiltersValue[0].id;
      this.params.f = this.typeFiltersValue[1].id;
      this.pageData.current = 1;
      this.params.p = 1;
      this.params.o = 'new';
      this.getList()
    },
    linkToProfile(id) {
      this.$router.push('/train/'+id)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.train-main {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.app-head {
  background: #fff;
  display: flex;
  border-bottom: 1px solid #e6e6e6;
  flex-direction: row;
  justify-content: center;
  @media screen and ( min-width: 1380px ) {
    .app-head-train {
      width: 1380px;
    }
  }
  @media screen and ( max-width: 1380px ) {
    .app-head-train {
      width: 1200px;
    }
  }
  .app-head-train {
    display: flex;
    flex-direction: column;
    .banner-area {
      padding-top: 30px;
      a {
        display: flex;
        img {
          width: 100%
        }
      }
    }
    .head-tab-render {
      display: flex;
      flex-direction: column;
      .tab-render-title {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 80px;
        line-height: 80px;
        border-bottom: 1px solid #ccc;
        h3 {
          font-weight: bold;
          color: #333;
          min-width: 66px;
        }
        .tab-render-search {
          .el-input-group__append {
            background-color: #333;
            color: #fff;
            border: 1px solid #333;
            button {
              width: 72px;
            }
          }
        }
        .el-input__inner {
          width: 400px;
          background: #f3f3f3;
        }
      }
      .tab-render-filter {
        display: flex;
        flex-direction: column;
        .filter-lists {
          border-bottom: 1px dashed #ccc;
          display: flex;
          flex-direction: row;
          .filter-lists-type {
            line-height: 60px;
            min-width: 60px;
            h4 {
              font-weight: bold;
              color: #333;
            }
          }
          .filter-lists-all {
            line-height: 60px;
            padding: 0 30px;
            cursor: pointer;
            min-width: 90px;
            .active {
              color: #ff9000;
            }
          }
          .filter-lists-items {
            @media screen and ( min-width: 1380px ) {
              ul {
                max-width: 1230px;
              }
            }
            @media screen and ( max-width: 1380px ) {
              ul {
                max-width: 1052px;
              }
            }
            ul {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              li {
                line-height: 60px;
                margin: 0 30px;
                span {
                  cursor: pointer;
                }
              }
              li.active {
                color: #ff9000;
              }
            }
          }
        }
        .filter-lists:last-child{
          border: none;
        }
      }
    }
  }
}
.app-list {
  padding: 20px 0;
  display: flex;
  justify-content: center;
  @media screen and ( min-width: 1380px ) {
    .app-list-content {
      width: 1380px;
    }
  }
  @media screen and ( max-width: 1380px ) {
    .app-list-content {
      width: 1200px;
    }
  }
  .app-list-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .app-list-left {
      flex-grow: 0;
      border-radius: 4px;
      overflow: hidden;
      .app-list-head-left{
        line-height: 45px;
        background: #fff;
        h3 {
          color: #333;
          span {
            position: relative;
            padding-left: 20px;
          }
          span::before {
            content: '';
            width: 5px;
            height: 16px;
            background-color: #fed900;
            display: inline-block;
            position: absolute;
            top: 4px;
            left: 0;
          }
        }
      }
      .app-list-render {
        background: #fff;
        .app-list-render-li {
          width: 228px;
          overflow: hidden;
          margin: 0 20px 20px;
          cursor: pointer;
          .app-list-item-img {
            height: 168px;
            overflow: hidden;
          }
          .app-list-item-content {
            padding: 15px 0;
            h4 {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              color: #333;
            }
          }
        }
      }
    }
    .app-list-right {
      flex-grow: 4;
      margin-left: 20px;
      .app-list-head-right {
        display: flex;
        background: white;
        flex-direction: row;
        justify-content: space-between;
        border-radius: 4px;
        h3 {
          flex-grow: 1;
          flex-basis: 0;
          color: #333;
          line-height: 45px;
          span {
            position: relative;
            padding-left: 20px;
          }
          span::before {
            content: '';
            width: 5px;
            height: 16px;
            background-color: #fed900;
            display: inline-block;
            position: absolute;
            top: 4px;
            left: 0;
          }
        }
        .app-list-head-tabs {
          flex-grow: 5;
          .el-tabs {
            .el-tabs__header {
              margin: 0;
              .el-tabs__nav-scroll {
                display: flex;
                justify-content: center;
                .el-tabs__nav {
                  .el-tabs__item {
                    height: 45px;
                    line-height: 45px;
                    transition: color .3s;
                    width: 68px;
                    text-align: center;
                    box-sizing: content-box;
                    font-size: 16px;
                    color: #b8b8b8;
                  }
                  .el-tabs__item.is-active {
                    color: #333;
                  }
                }
              }
              .el-tabs__nav-wrap::after {
                display: none;
              }
            }
            .el-tabs__content {
              display: none;
            }
          }

        }
        .app-list-head-tabs-empty {
          flex-grow: 1;
        }
      }
      .app-list-render {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        @media screen and ( min-width: 1380px ) {
          max-width: 1092px;
        }
        @media screen and ( max-width: 1380px ) {
          max-width: 914px;
        }
        .app-list-render-li {
          width: 260px;
          height: 346px;
          background: #fff;
          margin-top: 20px;
          border-radius: 4px;
          overflow: hidden;
          .app-list-item-img {
            height: 196px;
            overflow: hidden;
            a {
              img {
                width: 260px;
              }
            }
          }
          .app-list-item-content {
            display: flex;
            flex-direction: column;
            .app-list-item-content-render {
              flex-grow: 2;
              padding: 15px 10px 0 10px;
              display: flex;
              flex-direction: column;
              min-height: 98px;
              h4 {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                color: #333;
                flex-grow: 1;
              }
              .p1 {
                color: #ccc;
                flex-grow: 1;
                line-height: 24px;
                font-size: 12px;
                display: flex;
                flex-grow: 1;
                justify-content: space-between;
                .money {
                  color: #ff9000;
                  font-size: 18px;
                  display: inline-block
                }
                .ori {
                  display: inline-flex;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-decoration-line: line-through;
                }
              }
              .p2 {
                display: flex;
                flex-grow: 1;
                justify-content: space-between;
                line-height: 40px;
                font-size: 12px;
                height: 40px;
                span {
                  color: #ccc;
                }
                .look {
                  display: inline-block;
                  margin-right: 10px;
                }
                .look::before {
                  display: inline-block;
                  content: '';
                  width: 18px;
                  height: 12px;
                  background: url('../assets/View.png') no-repeat center center;
                  background-size: 100% 100%;
                  margin-right: 5px;
                  opacity: 0.5;
                }
                .number {
                  display: inline-block;
                  margin-right: 10px;
                }
                .number::before {
                  display: inline-block;
                  content: '';
                  width: 14px;
                  height: 12px;
                  background: url('../assets/comment.png') no-repeat center center;
                  background-size: 100% 100%;
                  margin-right: 5px;
                }
              }
            }
            .app-list-item-user {
              flex-grow: 1;
              border-top: 1px solid #dadada;
              display: flex;
              flex-direction: row;
              line-height: 50px;
              a {display: flex}
              .app-list-item-user-photo {
                width: 26px;
                height: 26px;
                border-radius: 50%;
                overflow: hidden;
                margin: 12px 10px;
                display: flex;
                img {
                  width: 100%;
                }
              }
              .app-list-item-user-name {
                color: #333;
                font-size: 12px;
                padding-left:12px;
              }
            }

          }
        }
      }
      .app-list-page {
        margin-top: 40px;
        display: flex;
        justify-content: center;
        .el-pagination.is-background .el-pager li {
          background-color: #fff;
        }
        .el-pagination.is-background .el-pager li:not(.disabled).active {
          background-color: #fadd1d;
        }
      }
    }
  }
}
</style>
