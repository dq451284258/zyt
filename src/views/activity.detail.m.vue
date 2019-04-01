<template>
  <div class="activity-detail-m">
    <div class="activity-detail-main">
      <div class="detail-body">
        <h2><strong>{{ title }}</strong></h2>
        <p class="time" v-show="start"><span>{{ '发布时间：'+start }}</span></p>
        <p class="time" v-show="end && isneed"><span>{{ '截止时间：'+end }}</span></p>
        <p class="content" v-html="content"></p>
      </div>
    </div>
      <div class="detail-bottom" v-if="isneed">
        <el-button type='info' v-if="noSignText === '已结束'">{{ noSignText }}</el-button>
        <el-button type='primary' v-else-if='!isSign' @click.prevent='sign'>报名</el-button>
        <el-button type='info' v-else>{{ noSignText }}</el-button>
      </div>
  </div>
</template>

<script>
  import { MessageBox } from 'mint-ui';
  import { Toast } from 'mint-ui';
  export default {
    name: 'activityDetailM',
    data() {
      return {
        title: '',
        start: '',
        end: '',
        content: '',
        id: '',
        isSign: false,
        isneed: false,
        noSignText: ''
      }
    },
    mounted() {
      this.getMessage()
    },
    watch: {
      $route() {
        Object.assign(this.$data, this.$options.data())
        this.getMessage()
      }
    },
    methods: {
      getMessage() {
        this.$ajax('/activity/'+this.$route.params.id).then(res => {
          if(res.data.result === 'success') {
            let data = res.data.data;
            this.title = data.event_title;
            this.start = this.timeFormat(data.created_time);
            this.end = data.end_time;
            this.content = data.event_content;
            this.id = data.id;
            this.isneed = data.apply_need === 1 ? true : false;
            let endtime = new Date(data.end_time).getTime(), curtime = new Date(data.now_time).getTime();
            if(endtime > curtime) {
              this.noSignText = '已报名'
            }else {
              this.noSignText = '已结束'
            }
          }
        }).catch(error => {

        })
      },
      timeFormat(time) {
        var date = new Date(time * 1000);
        var Y = date.getFullYear();
        var M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
        var D = date.getDate() < 10 ? '0'+date.getDate() : date.getDate();
        var h = date.getHours() < 10 ? '0'+date.getHours() : date.getHours();
        var m = date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes();
        var s = date.getSeconds();
        return Y+'/'+M+'/'+D+' '+h+':'+m;
      },
      sign() {
        const token = localStorage.getItem('token');
        const userid = localStorage.getItem('userid');
        if(!token || !userid || userid == 'undefined' || token == 'undefined') {
          this.$router.push('/m/login')
        }else {
          MessageBox.confirm('确定报名活动?').then(action => {
            this.$ajax.post('/activity/signup',{
              id: this.id,
              user_id: userid,
              token: token
            }).then(res => {
              if(res.data.result==='success') {
                Toast('恭喜您报名成功！');
                this.isSign = true;
              }else {
                if(res.data.data.errno=="-10002") {
                  this.$router.push('/m/login')
                }else {
                  Toast(res.data.data.errmsg);
                  this.isSign = true;
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
.activity-detail-m {
  height: 100%;
  width: 100%;
  .detail-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    button {
      color: #333;
      height: 50px;
      width: 100%;
    }
  }
  .activity-detail-main {
    height: 100%;
    position: relative;
    background: #fff;
    .detail-body {
      padding: 20px;
      margin-bottom: 50px;
      overflow: hidden;
      background: #fff;
      h2 {
        color: #333;
        margin-bottom: 20px;
      }
      .time {
        margin: 5px 0;
      }
      .content {
        margin: 15px 0;
        color: #333;
        font-size: 16px;
        img {
          max-width: 100%;
        }
        * {
          max-width: 100%;
        }
      }
    }
  }
}
</style>

