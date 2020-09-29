const obj = {}

import Toast from './Toast'

obj.install = function(Vue) {
  //install默认带入Vue对象
  console.log('install toast pulgin....', Vue)

  //将Toast中的template渲染的内容添加到DOM中
  //1. 创建组件构造器
  const toastConstructor = Vue.extend(Toast)
  //2. new一个组件对象
  const toast = new toastConstructor()
  //3. 加载对指定的dom元素上
  toast.$mount(document.createElement('div'))
  //4. 获取组件的$el并渲染当当前页面中
  document.body.appendChild(toast.$el)
  // console.log('toast.$el: ', toast.$el)

  //Vue原型中增加对象变量$toast，指向toast.vue
  Vue.prototype.$toast = toast
}

export default obj
