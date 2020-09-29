import {ADD_COUNT, ADD_TO_CART} from './mutation-types'

export default {
  addCart(context, payload) {
    //为了在添加购物车成功后使用toast提示，需要返回promise函数
    return new Promise((resolve, reject) => {
      let oldProduct = context.state.cartList.find((item) => item.iid === payload.iid)

      if (oldProduct) {
        //oldProduct.count++
        context.commit(ADD_COUNT, oldProduct)
        resolve('当前商品数量+1')
      } else {
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  },
}
