/*
 *
 *  此文件是整个项目的启动文件
 *
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import FastClick from 'fastclick'
import LazyLoad from 'vue-lazyload'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//用vue实例建立事件总线
Vue.prototype.$bus = new Vue()

// 安装toast插件, 系统会自动执行toast.index.js中的install函数
// console.log('toast: ', toast)
Vue.use(toast)

// 安装lazyload组件：当图片需要显示在屏幕上时，才加载此图片
// import loadingImg from './assets/img/common/placeholder.png'
// export default {
//   data() {
//     return {
//       loadingImg,
//     }
//   },
// }

Vue.use(LazyLoad, {
  loading: require('assets/img/common/placeholder.png'),
})

// 安装fastcilck，解决移动端300ms的延迟
FastClick.attach(document.body)

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount('#app')
