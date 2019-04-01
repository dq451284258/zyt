import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'
import train from '@/views/train'
import trainProfile from '@/views/train.profile'
import trainBuy from '@/views/train.buy'
import trainPlayer from '@/views/train.player'
import trainOrderM from '@/views/train.order.m'
import expert from '@/views/expert'
import contentService from '@/views/content'
import activity from '@/views/activity'
import news from '@/views/content.news'
import files from '@/views/content.files'
import works from '@/views/content.works'
import questionHall from '@/views/expert.questionHall'
import questionQuiz from '@/views/expert.quiz'
import expertPayment from '@/views/expert.payment'
import expertAnswerDetails from '@/views/expert.answerDetails'
import expertInformation from '@/views/expert.information'
import activityDetails from '@/views/activity.details'
import personal from '@/views/personal'
import personalTab from '@/views/personal.tab'
import personalDynamic from '@/views/personal.dynamic'
import personalProjects from '@/views/personal.projects'
import personalAttention from '@/views/personal.attention'
import personalCourse from '@/views/personal.course'
import personalFeedback from '@/views/personal.feedback'
import personalMyanswer from '@/views/personal.myanswer'
import personalMyquestion from '@/views/personal.myquestion'
import personalMywallet from '@/views/personal.mywallet'
import personalEdit from '@/views/personal.edit'
import personalApply from '@/views/personal.apply'
import personalAnswerM from '@/views/personal.answer.m'
import personalAnswerDetailM from '@/views/personal.answer.detail.m'
import login from '@/views/login'
import loginM from '@/views/login.m'
import log from '@/views/login.login'
import logM from '@/views/login.login.m'
import regist from '@/views/login.regist'
import registM from '@/views/login.regist.m'
import forgetpassword from '@/views/login.forgetpassword'
import forgetpasswordM from '@/views/login.forgetpassword.m'
import personalAddProject from '@/views/personal.addproject'
import walletlist from '@/views/personal.mywallet.list'
import walletTopup from '@/views/personal.mywallet.topup'
import walletWithdraw from '@/views/personal.mywallet.withdraw'
import personalM from '@/views/personal.m'
import personalPreviewM from '@/views/personal.preview.m'
import personalEditM from '@/views/personal.edit.m'
import personalCardM from '@/views/personal.card.m'
import personalCardsM from '@/views/personal.cards.m'
import personalQrcodeM from '@/views/personal.qrcode.m'
import personalCardImageM from '@/views/personal.cardImage.m'
import personalConsultM from '@/views/personal.consult.m'
import personalConsultDetailM from '@/views/personal.consult.detail.m'
import activityM from '@/views/activity.m'
import activityDetailM from '@/views/activity.detail.m'
import expertM from '@/views/expert.m'
import expertConsultM from '@/views/expert.consult.m'
import voteM from '@/views/vote.m'
import vote from '@/views/vote'
import voteDetailM from '@/views/vote.detail.m'
import voteDetail from '@/views/vote.detail'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index,
      meta: {
        title: '首页'
      }
    }, {
      path: '/train',
      name: 'train',
      component: train,
      meta: {
        title: '培训'
      }
    }, {
      path: '/train/:id',
      name: 'trainProfile',
      component: trainProfile,
      meta: {
        title: '培训详情'
      }
    }, {
      path: '/train/:id/buy',
      name: 'trainBuy',
      component: trainBuy,
      meta: {
        title: '购买课程'
      }
    }, {
      path: '/train/:id/play/:playid',
      name: 'trainPlayer',
      component: trainPlayer,
      meta: {
        title: '课程播放'
      }
    }, {
      path: '/m/train/:id/order/:orderid',
      name: 'trainOrderM',
      component: trainOrderM,
      meta: {
        title: '课程订单'
      }
    }, {
      path: '/expert',
      name: 'expert',
      component: expert,
      meta: {
        title: '专家咨询'
      }
    }, {
      path: '/content',
      name: 'contentService',
      component: contentService,
      meta: {
        title: '内容服务'
      },
      children: [{
        path: 'news',
        name: 'news',
        component: news
      }, {
        path: 'files',
        name: 'files',
        component: files
      }, {
        path: 'works',
        name: 'works',
        component: works
      }]
    }, {
      path: '/activity',
      name: 'activity',
      component: activity,
      meta: {
        title: '活动中心'
      }
    },{
      path: '/expert/questionhall',
      name: 'questionHall',
      component:questionHall,
      meta: {
        title: '问题大厅'
      }
    },{
      path: '/expert/quiz',
      name: 'questionQuiz',
      component:questionQuiz,
      meta: {
        title: '提问页面'
      }
    },{
      path: '/expert/payment',
      name: 'expertPayment',
      component:expertPayment,
      meta: {
        title: '提问成功'
      }
    },{
      path: '/expert/answer',
      name: 'expertAnswerDetails',
      component:expertAnswerDetails,
      meta: {
        title: '问题详情'
      }
    },{
      path: '/expert/information',
      name: 'expertInformation',
      component:expertInformation,
      meta: {
        title: '专家详情'
      }
    },{
      path: '/activity/details',
      name: 'activityDetails',
      component:activityDetails,
      meta: {
        title: '活动详情'
      }
    },{
      path: '/personal',
      name: 'personal',
      component:personal,
      children: [{
        path: '',
        name: 'personalTab',
        component: personalTab,
        meta: {
          title: '个人中心'
        },
        children: [{
          path: '',
          name: 'personalDynamic',
          component: personalDynamic,
          meta: {
            title: '所有动态'
          },
        },{
          path: 'projects',
          name: 'personalProjects',
          component: personalProjects,
          meta: {
            title: '项目中心'
          },
        },{
          path: 'course',
          name: 'personalCourse',
          component: personalCourse,
          meta: {
            title: '课程中心'
          },
        },{
          path: 'attention',
          name: 'personalAttention',
          component: personalAttention,
          meta: {
            title: '关注用户'
          },
        },{
          path: 'myquestion',
          name: 'personalMyquestion',
          component: personalMyquestion,
          meta: {
            title: '我的问题'
          },
        },{
          path: 'myanswer',
          name: 'personalMyanswer',
          component: personalMyanswer,
          meta: {
            title: '我的回答'
          },
        },{
          path: 'mywallet',
          name: 'personalMywallet',
          component: personalMywallet,
          meta: {
            title: '我的钱包'
          },
          children: [{
            path: '',
            name: 'walletlist',
            component: walletlist,
            meta: {
              title: '我的钱包'
            },
          },{
            path: 'topup',
            name: 'walletTopup',
            component: walletTopup,
            meta: {
              title: '我的钱包'
            },
          },{
            path: 'withdraw',
            name: 'walletWithdraw',
            component: walletWithdraw,
            meta: {
              title: '我的钱包'
            },
          }]
        },{
          path: 'feedback',
          name: 'personalFeedback',
          component: personalFeedback,
          meta: {
            title: '问题反馈'
          },
        },{
          path: 'addproject',
          name: 'personalAddProject',
          component: personalAddProject,
          meta: {
            title: '添加作品'
          }
        }]
      }]
    }, {
      path: '/personal/edit',
      name: 'personalEdit',
      component: personalEdit,
      meta: {
        title: '编辑资料'
      }
    }, {
      path: '/personal/apply',
      name: 'personalApply',
      component: personalApply,
      meta: {
        title: '申请专家'
      }
    }, {
      path: '/login',
      component:login,
      meta: {
        title: '登录'
      },
      children: [{
        path: '',
        name:'login',
        component: log,
        meta: {
          title: '登录'
        }
      },{
        path: 'regist',
        name:'regist',
        component: regist,
        meta: {
          title: '注册'
        }
      },{
        path: 'forgetpassword',
        name:'forgetpassword',
        component: forgetpassword,
        meta: {
          title: '忘记密码'
        }
      }]
    }, {
      path: '/m/login',
      component:loginM,
      meta: {
        title: '登录'
      },
      children: [{
        path: '',
        name:'loginM',
        component: logM,
        meta: {
          title: '登录'
        }
      },{
        path: 'regist',
        name:'registM',
        component: registM,
        meta: {
          title: '注册'
        }
      },{
        path: 'forgetpassword',
        name:'forgetpasswordM',
        component: forgetpasswordM,
        meta: {
          title: '忘记密码'
        }
      }]
    }, {
      path: '/m/personal/card/:userid',
      name:'personalCardM',
      component: personalCardM,
      meta: {
        title: '电子名片'
      }
    }, {
      path: '/m/personal',
      component:personalM,
      meta: {
        title: '个人中心'
      },
      children: [{
        path: '',
        name:'personalPreviewM',
        component: personalPreviewM,
        meta: {
          title: '个人中心'
        }
      }, {
        path: 'edit',
        name:'personalEditM',
        component: personalEditM,
        meta: {
          title: '编辑资料'
        }
      }, {
        path: 'cards',
        name:'personalCardsM',
        component: personalCardsM,
        meta: {
          title: '名片卡包'
        }
      }, {
        path: 'qrcode/:userid',
        name:'personalQrcodeM',
        component: personalQrcodeM,
        meta: {
          title: '名片二维码'
        }
      }, {
        path: 'card/image/:userid',
        name:'personalCardImageM',
        component: personalCardImageM,
        meta: {
          title: '名片图片'
        }
      }, {
        path: 'consult',
        name:'personalConsultM',
        component: personalConsultM,
        meta: {
          title: '我的咨询'
        }
      }, {
        path: 'consult/:id',
        name:'personalConsultDetailM',
        component: personalConsultDetailM,
        meta: {
          title: '咨询详情'
        }
      }, {
        path: 'answer',
        name:'personalAnswerM',
        component: personalAnswerM,
        meta: {
          title: '我的回答'
        }
      }, {
        path: 'answer/:id',
        name:'personalAnswerDetailM',
        component: personalAnswerDetailM,
        meta: {
          title: '回答详情'
        }
      }]
    }, {
      path: '/m/activity',
      name:'activityM',
      component: activityM,
      meta: {
        title: '活动'
      }
    }, {
      path: '/m/activity/:id',
      name:'activityDetailM',
      component: activityDetailM,
      meta: {
        title: '活动详情'
      }
    }, {
      path: '/m/expert',
      name:'expertM',
      component: expertM,
      meta: {
        title: '专家大厅'
      }
    }, {
      path: '/m/expert/consult/:id',
      name:'expertConsultM',
      component: expertConsultM,
      meta: {
        title: '咨询'
      }
    }, {
      path: '/m/vote',
      name:'voteM',
      component: voteM,
      meta: {
        title: ''
      }
    }, {
      path: '/m/vote/:id',
      name:'voteDetailM',
      component: voteDetailM,
      meta: {
        title: ''
      }
    }, {
      path: '/vote',
      name:'vote',
      component: vote,
      meta: {
        title: ''
      }
    }, {
      path: '/vote/:id',
      name:'voteDetail',
      component: voteDetail,
      meta: {
        title: ''
      }
    }
  ]
})
