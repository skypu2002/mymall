<template>
  <scroll class="content" ref="scroll">
    <!-- <div id="cart-list" class="cart-list"> -->
    <cart-list-item v-for="(item, index) in cartList" :item-info="item" :key="index" />
    <!-- </div> -->
  </scroll>
</template>
<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import {mapGetters} from 'vuex'

export default {
  name: 'CartList',
  data() {
    return {}
  },
  components: {
    Scroll,
    CartListItem,
  },
  computed: {
    ...mapGetters(['cartList']),
  },
  activated() {
    //当购物车商品发生变化时，刷新scroll高度
    this.$refs.scroll.refresh
  },
}
</script>

<style scoped>
/* 此处设置的位置正确有效： 1-设置cartlist的高度是100vh-顶部bar44px-底部导航49px */
.cart-list {
  /* 93=49(顶部tab)+44(底部导航), 40=计算bar */
  /* height: calc(100% - 93px - 300px); */
  /* overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0; */
}
/* content是滚动区域，是父元素cart-list的全部区域，超出部分做hidden */
.content {
  height: 80%;
  overflow: hidden;
}
</style>
