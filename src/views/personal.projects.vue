<template>
  <div class="personalProject">
    <div class="expert-projects-head">
      <div class="expert-projects-title">作品集</div>
      <!-- <div class="search-input">
        <el-input placeholder="请输入关键字搜索" v-model="searchinput" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click='search'></el-button>
        </el-input>
      </div> -->
    </div>
    <ul class='expert-projects' v-if='showproject'>
      <li v-for='(list,index) in expertProjectList' :key='index'>
        <div class="project-info">
          <div class="project-info-name" v-text='list.name'></div>
          <div class="project-info-desc">
            项目描述：{{list.desc}}
            <a class='checkdetails' v-if='list.projectshow' @click='projectdetails(list.id)' v-text='list.upordown'></a>
          </div>
        </div>
        <div class="projrct-picture">
          <div class='project-img'><img :src="$imageHost+list.img" alt=""></div>
          <div class='project-more'></div>
        </div>
      </li>
    </ul>
    <div class="nodata" v-if='!showproject'>
      <img src="../assets/nomessage.png" alt="">
    </div>
    <div class="page" v-if='showproject'>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change='changpageProject'
        :total="totalpageProject">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: 'personalProject',
  data () {
    return {
      expertProjectList:[],
      totalpageProject:1,
      searchinput:'',
      projectParams:{
        l:10,
        p:1
      },
      showproject:true
    }
  },
  mounted () {
    this.getMessage();
  },
  methods:{
    getMessage() {
      let userid = localStorage.getItem('userid');
      axios.all([this.$ajax('/user/projectlist/'+userid)])
      .then(axios.spread((projectlist) => {
        this.getproject(projectlist);
        this.$NProgress.done();
      })).catch((error) => {
        console.log(error)
      })
    },
    getproject(res){
      let [projectlist,arr,arr_list] = [res.data.data.data,'',[]];
        this.totalpageProject=res.data.data.total;
        if(this.totalpageProject==0){
          this.showproject=false;
        }
        for(let i = 0; i<projectlist.length;i++){
            arr={
                id:projectlist[i].id,
                name:projectlist[i].project_name,
                desc:projectlist[i].project_desc,
                img:projectlist[i].project_img,
                desctotal:projectlist[i].project_desc,
                projectshow:false,
                upordown:'查看详情',
                num:0
            }
            if(arr.desc.length>130){
                arr.desc=arr.desc.substring(0,129)+'...';
                arr.descshort=arr.desc;
                arr.projectshow=true;
            }
            arr_list.push(arr);
        }
        this.expertProjectList=arr_list;
    },
    projectdetails(index){
        for(let i = 0; i<this.expertProjectList.length;i++){
            if(this.expertProjectList[i].id==index){
                if(this.expertProjectList[i].num===0){
                    this.expertProjectList[i].desc=this.expertProjectList[i].desctotal;
                    this.expertProjectList[i].upordown='收起';
                    this.expertProjectList[i].num=1;
                }else{
                    this.expertProjectList[i].desc=this.expertProjectList[i].descshort;
                    this.expertProjectList[i].upordown='查看详情';
                    this.expertProjectList[i].num=0;
                }
                
            }
        }
    },
    changpageProject(e){
      this.projectParams.p=e;
      this.getprojectlist();
    },
    getprojectlist(){
      let userid = localStorage.getItem('userid');
      this.$ajax('/user/projectlist/'+userid,{
        params: this.projectParams
      }).then((res) => {
        this.getproject(res)
      }).catch((error) => {
        console.log(error)
      })
    },
    search(){
      alert(111);
      this.projectParams.k=this.searchinput;
      this.getprojectlist();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.personalProject{
  padding: 0 20px 0 32px;
  .expert-projects-head{
    display: flex;
    margin-top: 20px;
    .expert-projects-title{
      flex: 1;
      font-size: 16px;
      font-weight: 700;
      color: #2f2e2e;
      line-height: 40px;
      position: relative;
    }
    .expert-projects-title:before{
      content: '';
      width: 4px;
      height: 12px;
      background: #fed900;
      position: absolute;
      top: 14px;
      left: -32px;
    }
  }
  .nodata{
    text-align: center;
    margin-top: 100px;
    padding-bottom: 100px;
  }
  .page{
    margin: 20px 0;
    display: flex;
    justify-content:center;
    .el-pagination{
      display: inline-block;
    }
  }
  .expert-projects{
    li{
      display: flex;
      padding: 30px 0;
      border-bottom: 1px solid #f4f4f4;
      .project-info{
        max-width: 665px;
        .project-info-name{
          font-size: 16px;
          color: #333;
          font-weight: 700;
          line-height: 16px;
        }
        .project-info-data{
          font-size: 14px;
          color: #999;
          line-height: 28px;
        }
        .project-info-desc{
          font-size: 14px;
          color: #666;
          line-height: 22px;
          margin-top: 15px;
          .checkdetails{
            color: #ff9000;
            cursor: pointer;
          }
        }
      }
      .projrct-picture{
        display: flex;
        flex:1;
        justify-content: flex-end;
        .project-img{
          width: 212px;
          height: 136px;
          margin-right: 10px;
          img{
            width: 100%;
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
    }
  }
}
</style>
