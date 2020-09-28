import {ADD_COUNT, ADD_TO_CART} from './mutation-types'

export default {
  //mutations 唯一的目的就是修改state中的状态，每个方法尽可能只完成单一的时事件
  //所以以下有业务逻辑的处理要放到action中执行
  // addCart(state, payload) {
  //   let oldProduct = state.cartList.find((item) => item.iid === payload.iid)
  //   if (oldProduct) {
  //     oldProduct.count++
  //   } else {
  //     payload.count = 1
  //     state.cartList.push(payload)
  //   }
  // },

  [ADD_COUNT](state, payload) {
    payload.count++
  },

  [ADD_TO_CART](state, payload) {
    payload.checked = true
    state.cartList.push(payload)
  },
}
