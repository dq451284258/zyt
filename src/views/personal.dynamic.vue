<template>
  <div class="personalDynamic">
    <ul class='expert-dynamic' v-if='showdynamic'>
      <li v-for='(list,index) in expertDynamicList' :key='index'>
        <div class="expert-dynamic-answer classify-list">
          <div class="expert-dynamic-img">
            <div class="expert-dynamic-date" v-text='list.create_time'></div>
          </div>
          <div class="expert-dynamic-info">
            <div class="expert-dynamic-info-sort" v-text='list.title'></div>
            <div class="expert-dynamic-info-courename">
              <a :href="list.url" v-text='list.subtitle'></a>
            </div>
            <div class="expert-dynamic-info-desc">
              <span v-if='list.content'>问题描述：</span>
              <span v-text='list.content'></span>
              <a :href="list.url" class='checkdetails' v-if='list.ifshow'>查看详情</a>
            </div>
          </div>
          <div class="expert-dynamic-picture" @click='todetails(list.url)'>
            <div class='project-img' v-for='(item,index) in list.images' :key='index'><img :src="item" alt=""></div>
            <div class='project-img' v-if='list.images==""?true:false'><img src="../assets/defaultclass.jpg" alt=""></div>
            <div class='project-more'></div>
          </div>
        </div>
      </li>
    </ul>
    <div class="nodata" v-if='!showdynamic'>
      <img src="../assets/nomessage.png" alt="">
    </div>
    <div class="page"  v-if='showdynamic'>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='changpageDynamic'
        :page-size="pageSize"
        :total="totalpageDynamic">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'personalDynamic',
  data () {
    return {
      totalpageDynamic:1,
      expertDynamicList:[],
      params:{
        l:10,
        p:1
      },
      pageSize:10,
      showdynamic:true,
      hosturl:''
    }
  },
  mounted () {
    this.getMessage();
    this.hosturl='https://'+window.location.host+'/#';
  },
  methods:{
    todetails(url){
      window.location.href=url;
    },
      getMessage() {
      this.params.user_id=localStorage.getItem('userid') || '';
      this.params.token=localStorage.getItem('token') || '';
      axios.all([this.$ajax.get('/user/dynamiclist/'+this.params.user_id,{
        params: this.params
      })])
      .then(axios.spread((answerlist) => {
        this.getdata(answerlist);
        this.$NProgress.done();
      })).catch((error) => {
        console.log(error)
      })
    },
    getdata(res){
      let [courselist,arr,arr_list]=[res.data.data.data,'',[]];
      this.totalpageDynamic=res.data.data.total;
      if(this.totalpageDynamic==0){
        this.showdynamic=false;
      }
      for(let i = 0; i<courselist.length;i++){
        arr={
          create_time:courselist[i].create_time,
          title:courselist[i].dynamic_data.title,
          subtitle:courselist[i].dynamic_data.subtitle,
          content:courselist[i].dynamic_data.content,
          images:courselist[i].dynamic_data.images,
          url:this.hosturl+courselist[i].dynamic_data.url.split('#')[1],
        }
        if(arr.images){
          for(let j = 0; j<arr.images.length;j++){
            arr.images[j]=this.$getImageUrl(arr.images[j],212,136)
          }
        }
        if(arr.content){
            if(arr.content.length>73){
                arr.content=arr.content.substring(0,72)+"...";
                arr.ifshow=true;
            }else{
                arr.ifshow=false;
            }
        }else{
            arr.ifshow=false;
        }
        arr_list.push(arr);
      }
      console.log(arr_list);
      this.expertDynamicList=arr_list;
    },
    changpageDynamic(e){
      this.params.p=e;
      this.getpagedata();
    },
    getpagedata(){
        this.$ajax('/user/dynamiclist/'+localStorage.getItem('userid'),{
            params: this.params
        }).then((res) => {
            this.getdata(res)
        }).catch((error) => {
            console.log(error)
        })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.personalDynamic{
  // padding: 0 25px 0 30px;
  max-width: 1160px;
  .nodata{
    text-align: center;
    margin-top: 100px;
    padding-bottom: 100px;
  }
  .expert-dynamic{
    padding: 0 25px 0 30px;
    li{
      width: 100%;
      border-bottom: 1px solid #f4f4f4;
      padding: 30px 0;
      font-size: 14px;
      color: #999;
      .classify-list{
        display: flex;
        .expert-dynamic-img{
          width: 80px;
          height: 80px;
          border-radius: 80px;
          margin-right: 20px;
          flex-shrink:0;
          img{
            width: 100%;
          }
          .expert-dynamic-date{
            text-align: center;
          }
        }
        .expert-dynamic-picture{
          display: flex;
          flex:1;
          justify-content: flex-end;
          .project-img{
            margin-right: 10px;
            width: 212px;
            height: 136px;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .project-more{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex-shrink:1;
            width: 7px;
            height: 25px;
            margin-top: 54px;
            position: relative;
            margin-left: 15px;
            background: url("../assets/more_icon.png") no-repeat;
          }
          .project-more:hover{
            cursor: pointer;
            background: url("../assets/more_2.png") no-repeat;
          }
        }
        .expert-dynamic-info{
            max-width: 400px;
            margin-right: 10px;
          .expert-dynamic-info-sort{
            color: #999;
            font-size: 14px;
            margin-bottom: 5px;
          }
          .expert-dynamic-info-courename{
            font-size: 16px;
            color: #333;
            font-weight: 700;
            margin-bottom: 12px;
            a{
                color: #333;
            }
          }
          .checkdetails{
              color: #ff9000;
          }
        }
      }
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
}
</style>
