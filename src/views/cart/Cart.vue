<template>
  <div id="cart" class="cart">
    <!-- 顶部导航 -->
    <nav-bar class="nav-bar">
      <div slot="center" class="title">购物车({{ cartCount }})</div>
    </nav-bar>

    <!-- 购物车清单列表 -->
    <cart-list />
    <!-- 底部操作栏 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from 'components/common/navibar/NaviBar'

import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

//用mapGetters可以直接把vuex中的getter变量映射到局部computed属性
import {mapGetters} from 'vuex'

export default {
  name: 'Cart',
  computed: {
    // ...mapGetters(['cartLength']),   //两种写法
    ...mapGetters({
      cartCount: 'cartLength',
    }),
  },
  components: {
    NavBar,
    CartList,
    CartBottomBar,
  },
}
</script>

<style scoped>
#cart {
  /* 以下设置可以使得detail页面覆盖住底部的主菜单栏 */
  position: relative;
  background-color: #fff;
  height: 100vh;
  /* height: calc(100% - 93px - 300px); */
}

.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: normal;
}
</style>
