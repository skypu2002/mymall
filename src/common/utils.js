/**
 * 防抖函数： 传入函数、延时时间
 * 用于解决某些方法被频繁的调用，提供性能
 */
export function debounce(func, delay) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 使用正则表达式来处理日期格式化
 * y+: 匹配1个或多个y
 * y*: 匹配0个或多个y
 * y?: 匹配0个或1个y
 * @param {*} date ：单位毫秒（所以需要先*1000，是unix诞生起的时间戳
 * @param {*} fmt ： yyy-MM-dd hh:mm:ss
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}
// 可在字符串中抽取从 start 下标开始的指定数目的字符。
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
