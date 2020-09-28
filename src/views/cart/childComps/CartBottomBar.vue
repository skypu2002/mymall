<template>
  <div id="bottom-bar" class="bottom-bar">
    <div class="check-content">
      <check-button class="check-all" />
      <span>全选</span>
    </div>
    <div class="total-price">合计: {{ totalPrice }}</div>
    <div class="calculate">去结算({{ checkCount }})</div>
  </div>
</template>

<script>
import CheckButton from './CheckButton'
import {mapGetters} from 'vuex'

export default {
  name: 'CartBottomBar',
  data() {
    return {}
  },
  components: {
    CheckButton,
  },
  computed: {
    ...mapGetters(['cartList', 'cartLength']),
    totalPrice() {
      return (
        '￥' +
        this.cartList
          .filter((item) => {
            return item.checked
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count
          }, 0)
          .toFixed(2)
      )
    },
    checkCount() {
      return this.cartList.filter((item) => {
        return item.checked
      }).length
    },
  },
}
</script>

<style scoped>
.bottom-bar {
  display: flex;
  position: relative;
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  color: #000;
}

.check-content {
  display: flex;
  width: 90px;
  align-items: center;
  margin-left: 10px;
  line-height: 40px;
}

.check-all {
  margin-top: 10px;
  margin-right: 5px;
  width: 20px;
  height: 20px;
}

.total-price {
  margin-left: 30px;
  flex: 1;
}

.calculate {
  width: 90px;
  background-color: var(--color-tint);
  color: #fff;
  text-align: center;
}
</style>
