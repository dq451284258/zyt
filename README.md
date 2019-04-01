# 祝英台前端项目

**祝英台项目技术**

- [node.js](https://nodejs.org/zh-cn/)
- [Vue.js](https://cn.vuejs.org/)
- [Element-UI](http://element.eleme.io/#/zh-CN)
- [Axios](https://www.axios.com/)([中文可以参考这里](https://www.kancloud.cn/yunye/axios/234845))
- [Less](http://lesscss.cn/)
- [Nprogress](http://ricostacruz.com/nprogress/)

**Vue + Webpack 构建祝英台项目**

1. 安装 [node.js](https://nodejs.org/zh-cn/) ;

2. 安装 webpack ;
```
cnpm install webpack -g
```
3. 全局安装vue-cli ;
```
cnpm install -g vue-cli
```
4. 创建基于webpack的新项目( projectmanage ) ;
```
vue init webpack zyt
```
5. 安装项目依赖 ：
```
cd projectmanage
cnpm install
npm run dev
```
6. 目前用到的插件 ：
```
# Element-UI
cnpm i element-ui -S
# Less
cnpm install less less-loader --save
# Axios
cnpm install --save axios
```
