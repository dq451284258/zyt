<template>
  <div id="payment">
    <div class="payment-main">
        <div class='payment-img'><img src="../assets/tjcg_icon.png" alt=""></div>
        <div class="paymentSucceed">
            提问成功!
        </div>
    </div>
    <div class="payment-recommend">
        <div class="payment-inner">
            <div class="payment-recommend-title">推荐专家</div>
            <ul class='payment-recommed-list'>
                <li v-for='(list,index) in expertList' :key="index" @click='toexpertdetails(list.id)'>
                    <div class="question-img">
                        <img :src="$imageHost+list.img" alt="" v-if='list.img?true:false'>
                    </div>
                    <div class="question-info">
                        <div class="question-describe">
                            <span v-text='list.name' class='expert-name'></span>
                            <span v-text='list.leval' class='expert-leval'></span>
                        </div>
                        <div class="question-skill" v-text='list.skill'></div>
                        <div class="question-name">
                            <span class='payment-company' v-text='list.company' v-show='list.company?true:false'></span>
                            <span class='payment-position' v-text='list.position' v-show='list.position?true:false'></span>
                        </div>
                        <a href="javascript:;"  class="question-price"><el-button type="primary">￥{{list.price}}元提问</el-button></a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'payment',
  data () {
    return {
      expertList:[]
    }
  },
  watch: {
    '$route' (to, from) {
      this.getMessage();
    },
  },
  mounted () {
    this.getMessage();
  },
  methods:{
      getMessage() {
        axios.all([this.$ajax('/expert/recom')])
        .then(axios.spread((recommendlidt) => {
            this.getdata(recommendlidt);
            this.$NProgress.done();
        })).catch((error) => {
            console.log(error)
        })
      },
      getdata(res){
        let [datalist,arr,arr_list] = [res.data.data,'',[]];
        for(let i = 0; i<datalist.length;i++){
            arr={
                img:datalist[i].avatar,
                skill:datalist[i].skill_name,
                name:datalist[i].name,
                id:datalist[i].user_id,
                price:datalist[i].ask_price,
                company:datalist[i].company,
                position:datalist[i].company_position,
            }
            arr_list.push(arr);
        }
        this.expertList=arr_list;
      },
      toexpertdetails(id){
          this.$router.push({ name: 'expertInformation',query:{id:id}})
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
#payment{
  .payment-main{
    background: #fff;
    height: 365px;
    display: flex;
    flex-direction:column;
    justify-content: center;
    margin-bottom: 20px;
    div{
        margin: 0 auto;
    }
    .payment-img{
        width: 165px;
        img{
            width: 100%;
        }
    }
    .paymentSucceed{
        font-size: 16px;
        font-weight: 700;
        color: #040001;
        margin-top: 28px;
        text-align: center;
    }
  }
  .payment-recommend{
    .payment-inner{
        max-width: 1380px;
        margin: 0 auto;
        background: #fff;
        padding: 32px 25px 0 25px;
        border-radius: 3px;
        .payment-recommend-title{
            display: inline-block;
            font-size: 16px;
            color: #2f2e2e;
            height: 28px;
            border-bottom: 3px solid #fed900;
            margin-right: 50px;
        }
        .payment-recommed-list{
            width: 100%;
            display: flex;
            flex-wrap:wrap;
            margin-bottom: 20px;
            border-radius: 3px;
            li{
                width: 33.3%;
                background: #fff;
                display: flex;
                padding-top: 32px;
                padding-bottom: 35px;
                border-bottom: 1px solid #f4f4f4;
                min-width: 225px;
                .question-img{
                    // float: left;
                    width: 77px;
                    height: 77px;
                    background: url(../assets/morenmoren.jpg);
                    background-size: 100% 100%;
                    border-radius: 77px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 100%;
                    }
                }
                .question-info{
                    // float: left;
                    margin-left: 15px;
                    font-size: 12px;
                    .question-describe{
                        font-size: 12px;
                        color: #212121;
                        height: 24px;
                        .expert-name{
                            font-size: 16px;
                            color: #333434;
                            font-weight: 700;
                            margin-right: 20px;
                        }
                        .expert-leval{
                            position: relative;
                        }
                        .expert-leval:before{
                            content: '';
                            width: 9px;
                            height: 9px;
                            border-radius: 9px;
                            background: url('../assets/fffff_03.png');
                            position: absolute;
                            top: -9px;
                            right: 5px;
                        }
                    }
                    .question-skill{
                        color: #999;
                        height: 24px;
                        margin-top: 8px;

                    }
                    .question-name{
                        color: #999;
                        height: 34px;
                        .payment-company{
                            padding-right: 10px;
                        }
                        .payment-position{
                            // margin-left: 10px;
                            border-left: 1px solid #d2d2d2;
                            padding-left: 10px;
                        }
                    }
                    .question-price{
                        color: #2f2e2e;
                        width: 128px;
                        height: 22px;
                        border-radius: 3px;
                        text-align: center;
                        line-height: 22px;
                        button{
                            width: 128px;
                            height: 22px;
                            color: #2f2e2e;
                            padding: 0;
                        }
                    }
                }
            }
        }
    }
  }
}
</style>
