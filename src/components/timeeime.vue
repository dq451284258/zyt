<template>
    <div v-if='ifshow'>
        <div class="details-other-join-time" v-if='!threeday'>
            <div class="time-surplus" v-text='hourone'></div>
            <div class="time-surplus timelast" v-text='hourtwo'></div>
            <div class="timecenter">
                <div class="timedot timeone"></div>
                <div class="timedot"></div>
            </div>
            <div class="time-surplus" v-text='minuteone'></div>
            <div class="time-surplus timelast" v-text='minutetwo'></div>
            <div class="timecenter">
                <div class="timedot timeone"></div>
                <div class="timedot"></div>
            </div>
            <div class="time-surplus" v-text='secondone'></div>
            <div class="time-surplus timelast" v-text='secondtwo'></div>
        </div>
        <div class="details-other-join-time" v-if='threeday'>
            <div class="time-surplus" v-text='dayone'></div>
            <div class="time-surplus timelast" v-text='daytwo'></div>
            <span class='day'>天</span>
        </div>
    </div>
</template>

<script>
    export default{
        data () {
            return {
                time : '',
                flag : false,
                dayone:'',
                daytwo:'',
                hourone:'',
                hourtwo:'',
                minuteone:'',
                minutetwo:'',
                secondone:'',
                secondtwo:'',
                threeday:true,
                currentdate:'',
                mewtime:'',
                ifshow:false
            }
        },
        mounted () {
            this.mewtime = new Date(this.nowTime);
            this.currentdate=this.mewtime.getTime();
            let time = setInterval(()=>{
                if(this.flag == true){
                    clearInterval(time)
                }
                this.changenoetime()
            },1000)
        },
        props : {
            endTime : {
                type : String
            },
            nowTime:{
                type : String
            }
        },
        methods : {
            changenoetime(){
                this.currentdate=this.currentdate+1000;
                this.timeDown();
            },
            timeDown () {
                const endTime = new Date(this.endTime)
                let leftTime = parseInt((endTime.getTime()-this.currentdate)/1000);
                let d = parseInt(leftTime/(24*60*60));
                if(leftTime > 3 * (24*60*60)){
                    this.threeday=true;
                }else{
                    this.threeday=false;
                }
                let h = this.formate(parseInt(leftTime / (60*60)));
                let m = this.formate(parseInt((leftTime % (60*60)) / 60));
                let s = this.formate(parseInt(((leftTime % (60*60)) % 60)));
                if(leftTime <= 0){
                    this.flag = true;
                    this.$emit('time-end');
                    this.$emit('watchChild'); 
                }
                this.time = `${d}天${h}小时${m}分${s}秒`;
                this.dayone=Math.floor(d/10);
                this.daytwo=d%10;
                this.hourone=Math.floor(h/10);
                this.hourtwo=h%10;
                this.minuteone=Math.floor(m/10);
                this.minutetwo=m%10;
                this.secondone=Math.floor(s/10);
                this.secondtwo=s%10;
                this.ifshow=true;
            },
            formate (time) {
                if(time>=10){
                    return time
                }else{
                    return `0${time}`
                }
           }
        }
    }
</script>
<style scoped lang="less">
    .details-other-join-time{
        margin-top: 40px;
        display: flex;
        justify-content: center;
        color: #fff;
        font-size: 48px;
        font-weight: 700;
        font-family: '宋体';
        .day{
            color:#333;
            font-size: 16px;
            margin-left: 10px;
            margin-top: 37px;
            font-family: '微软雅黑';
        }
        .time-surplus{
            width: 43px;
            height: 57px;
            text-align: center;
            line-height: 57px;
            background-image: url('../assets/timenum.png');
        }
        .timecenter{
            margin:20px 8px 0;
            .timedot{
                width: 6px;
                height: 6px;
                border-radius: 6px;
                background: #454646;
            }
            .timeone{
                margin-bottom: 6px;
            }
        }
        .timelast{
            margin-left: 8px;
        }
    }
</style>
