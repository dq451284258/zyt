// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Share from 'vue-social-share'
import 'vue-social-share/dist/client.css'
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import promise from 'es6-promise'
import VueQriously from 'vue-qriously'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'

promise.polyfill()
Vue.use(ElementUI)
Vue.use(Share)
Vue.use(vuescroll)
Vue.use(VueQriously)
Vue.use(Mint)

/* ajax接口调用处理(待修改) */
var host = process.env.NODE_ENV === 'development' ? '/api/api/v1' : '/api/v1'
var instance = axios.create({
  baseURL: host
})
Vue.prototype.$ajax = instance //$ajax代替axios
Vue.prototype.$host = process.env.NODE_ENV === 'development' ? 'https://zyt-dev.arctron.cn' : 'https://zyt-dev.arctron.cn'

Vue.prototype.$imageHost = 'http://zyt-file.arctron.cn'

let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
let ua = navigator.userAgent.toLowerCase();
let isMobile;
if(flag) {
  isMobile = true;
}else if(ua.indexOf('micromessenger') != -1){
  isMobile = true;
}else {
  isMobile = false;
}
Vue.prototype.$isMobile = isMobile;

/* 路由进度条 */
NProgress.configure({ease: 'ease', speed: 500, showSpinner: false, minimum: 0.7})
router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    sessionStorage.clear();
  }
  if(!flag) {
    NProgress.start()
  }
  document.title = to.meta.title ? to.meta.title : '筑英台' //设置页面title
  next()
  Vue.prototype.$pathFrom = from
  Vue.prototype.$pathTo = to
  setTimeout(()=>{
    let _hmt = _hmt || [];
      (function() {
        document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f530c4507ea217b03eb59ce1257c0914";
        hm.id = "baidu_tj"
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
  },0);
})
router.afterEach(transition => {
  // NProgress.done()
})
Vue.prototype.$NProgress = NProgress

Vue.prototype.$getImageUrl = (url, w = '', h = '', q = 100) => {
  if(url) {
    if(url.split('/w/').length > 1) {
      let wurl = url.split('/w/')[0]
      let trueurl = 'http://zyt-file.arctron.cn' + wurl + '/w/' + w + '/h/' + h + '/q/' + q
      return trueurl
    }else {
      return url
    }
  }else {
    return ''
  }
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
