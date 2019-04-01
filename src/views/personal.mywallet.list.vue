<template>
  <div class="walletList">
    <div class="wallect-deal-title">交易记录</div>
    <ul class='wallect-deal-list' v-if='!showpage'>
      <li v-for='(list,index) in deallist' :key='index'>
        <div class="wallect-deal-list-info">
          <div class="wallect-deal-list-info-status" v-text='list.status'></div>
          <div class="wallect-deal-list-info-order">交易单号：{{list.order}}</div>
        </div>
        <div class="wallect-deal-list-desc">
          <div class="wallect-deal-list-desc-operator" v-text='list.operator'></div>
          <div class="wallect-deal-list-desc-info">
            <div class="wallect-deal-list-desc-info-name" v-text='list.name'></div>
            <div class="wallect-deal-list-desc-info-date" v-text='list.date'></div>
          </div>
          <div class="wallect-deal-list-desc-money"><span class="wallect-deal-list-desc-money-num" v-text='list.number'></span> 元</div>
        </div>
      </li>
    </ul>
    <div class="nodata" v-if='showpage'>
      <img src="../assets/nomessage.png" alt="">
    </div>
    <div class="page" v-if='!showpage'>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='changpage'
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalpage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'walletList',
  data () {
    return {
      balance:1000,
      income:1000,
      expend:1000,
      deallist:[],
      currentPage:1,
      pageSize:10,
      totalpage:1,
      params:{
        page:1,
        size:10
      },
      showpage:false
    }
  },
  mounted () {
    this.getMessage();
  },
  methods:{
    getMessage() {
      this.params.user_id=localStorage.getItem('userid') || '';
      this.params.token=localStorage.getItem('token') || '';
      axios.all([this.$ajax.get('/pay/billing',{
        params: this.params
      })]).then(axios.spread((billing) => {
        this.getbilling(billing);
        this.$NProgress.done();
      })).catch(axios.spread((billing) => {
        console.log('filter:' + billing)
      }))
    },
    getbilling(res){
      let [datalist,arr,arr_list] = [res.data.data.data,'',[]];
      this.totalpage=res.data.data.total;
      if(this.totalpage<=0){
        this.showpage=true;
      }else{
        this.showpage=false;
      }
      for(let i = 0; i<datalist.length;i++){
        arr={
          'date':this.timestampToTime(datalist[i].creattime),
          'order':datalist[i].orderid,
          'name':datalist[i].subject,
          'number':datalist[i].income/100,
          'status':'完成'
        }
        if(arr.name.length>36){
          arr.name=arr.name.substring(0,36)+'...';
        }
        if(datalist[i].income>0){
          arr.operator='收入'
        }else{
          arr.operator='付款'
        }
        arr_list.push(arr);
      }
      this.deallist=arr_list;
    },
    changpage(e){
      this.params.page=e;
      this.getpagedata();
    },
    getpagedata(){
      this.$ajax('/pay/billing',{
        params: this.params
      }).then((res) => {
        this.getbilling(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      let D = (date.getDate() < 10? '0' + date.getDate():date.getDate())+ ' ';
      let h = (date.getHours()< 10? '0' + date.getHours():date.getHours()) + ':';
      let m = (date.getMinutes()< 10? '0' + date.getMinutes():date.getMinutes()) + ':';
      let s = (date.getSeconds()< 10? '0' + date.getSeconds():date.getSeconds());
      return Y+M+D+h+m+s;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.walletList{
  @media screen and ( max-width: 1380px ) {
    .wallect-deal-list li{
      width: 450px!important;
    }
  }
  .page{
    margin: 20px 0;
    display: flex;
    justify-content:center;
    .el-pagination{
      display: inline-block;
    }
  }
  .nodata{
    text-align: center;
    margin-top: 100px;
    margin-bottom: 100px;
  }
  .wallect-deal-title{
    display: inline-block;
    margin-top: 35px;
    color: #333;
    font-size: 16px;
    padding-bottom: 8px;
    border-bottom: 3px solid #fed900;
  }
    .wallect-deal-list{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-bottom: 55px;
        li{
        width: 500px;
        height: 150px;
        border: 1px solid #cccccc;
        margin-top: 30px;
        font-size: 14px;
        .wallect-deal-list-info{
            display: flex;
            height: 48px;
            background: #f3f5f7;
            border-bottom: 1px solid #ccc;
            padding-top: 11px;
            .wallect-deal-list-info-status{
            color: #fff;
            // background: #ff9000;
            background: url('../assets/money.png') no-repeat;
            width: 78px;
            height: 26px;
            text-align: center;
            line-height: 26px;
            }
            .wallect-deal-list-info-order{
            line-height: 26px;
            margin-left: 20px;
            }
        }
        .wallect-deal-list-desc{
            display: flex;
            padding: 20px 0 25px 0;
            box-sizing: border-box;
            .wallect-deal-list-desc-operator{
            font-size: 18px;
            padding-top: 20px;
            color: #ff9000;
            width: 76px;
            text-align: center;
            border-right: 1px solid #f4f4f4;
          }
          .wallect-deal-list-desc-info{
            padding-left: 20px;
            width: 272px;
            .wallect-deal-list-desc-info-name{
              min-height: 38px;
            }
            .wallect-deal-list-desc-info-date{
                color: #ccc;
            }
          }
          .wallect-deal-list-desc-money{
            color: #ff9000;
            margin-left: 20px;
            .wallect-deal-list-desc-money-num{
                font-size: 24px;
            }
          }
        }
      }
    }
}
</style>
