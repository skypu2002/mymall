<template>
  <div id="bottom-bar" class="bottom-bar">
    <div class="check-content">
      <check-button class="check-all" :is-checked="isSelectAll" @click.native="chekAllClick" />
      <span>全选</span>
    </div>
    <div class="total-price">合计: {{ totalPrice }}</div>
    <div class="calculate" @click="calClick">去结算({{ checkCount }})</div>
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
    isSelectAll() {
      // return this.cartList.filter((item) => item.checked).length
      if (this.cartList.length === 0) return false
      // console.log('isSelectAll: ', !this.cartList.find((item) => item.checked))
      // let isSelected = this.cartList.find((item) => item.checked)
      // return isSelected

      //遍历方法
      for (let item of this.cartList) {
        // console.log('item: ', item.iid, item.checked)
        if (!item.checked) return false
      }
      return true
    },
  },
  methods: {
    chekAllClick() {
      if (this.isSelectAll) {
        this.cartList.forEach((item) => (item.checked = false))
      } else {
        this.cartList.forEach((item) => (item.checked = true))
      }

      //此处不能做简化写法，因为执行中会影响isSelectAll
      // this.cartList.forEach((item) => (item.checked = !this.isSelectAll))
    },
    calClick() {
      // console.log('calClick: ')
      if (!this.isSelectAll) {
        this.$toast.show('请选择要购买的商品!')
      }
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
  padding-left: 28px;
}

.check-all {
  position: absolute;
  line-height: 0;
  left: 12px;
  top: 13px;
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
