import axios from 'axios'

//终极的解决方法， 实际上在request3不需要使用promise函数，因为instance方法本身返回的就是Promise，可以进一步简化
export function request(config) {
  //创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 5000,
  })

  //拦截器处理
  //请求拦截
  instance.interceptors.request.use(
    (config) => {
      //拦截成功
      // console.log('请求拦截成功', config)
      // 比如可以在界面升显示loading 信息
      // 比如请求需要增加一些特殊信息：token
      //拦截以后必须重新返回config，否则后续会失败！
      return config
    },
    (err) => {
      //拦截失败
      // console.log('请求拦截失败', err)
    }
  )

  //响应请求
  instance.interceptors.response.use(
    (res) => {
      // console.log('响应拦截成功', res)
      return res
    },
    (err) => {
      //拦截失败
      // console.log('响应拦截失败', err)
    }
  )

  //发送请求
  return instance(config)
}
