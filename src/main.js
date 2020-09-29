/*
 *
 *  此文件是整个项目的启动文件
 *
 */

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//用vue实例建立事件总线
Vue.prototype.$bus = new Vue()

// 安装toast插件, 系统会自动执行toast.index.js中的install函数
// console.log('toast: ', toast)
Vue.use(toast)

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount('#app')
