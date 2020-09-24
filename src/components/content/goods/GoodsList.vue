<template>
  <div class="goods">
    <goods-list-item v-for="item in goods" :goods-item="item" />
  </div>
</template>
<script>
import GoodsListItem from "components/content/goods/GoodsListItem";

export default {
  name: "GoodsList",
  props: {
    goods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  components: {
    GoodsListItem,
  },
};
</script>
<style scoped>
.goods {
  display: flex;
  flex-wrap: wrap; /* 根据显示的宽度自动多行显示 */
  justify-content: space-around; /* 每个元素之间均等分，但两边的空白为其一半 */
  padding: 3px;
}
</style>