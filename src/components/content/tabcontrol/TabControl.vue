<template>
  <!-- 此控件只有文字不一样，不需要使用solt -->
  <div class="tab-control">
    <div
      v-for="(item, index) in titles"
      class="tab-control-item"
      :class="{active: currentIndex == index}"
      @click="itemClick(index)"
    >
      <span>{{item}}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "TabControl",
  props: {
    titles: {
      type: Array,
      //当值为对象或数组时，default必须为函数
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  methods: {
    itemClick(index) {
      this.currentIndex = index;
      //从子组件向外传递参数，用emit方法
      this.$emit("tabClick", index);
    },
  },
};
</script>
<style scoped>
.tab-control {
  /* 设置整行元素总体的样式 */
  display: flex; /* 使用flexgrid样式 */
  text-align: center;
  font-size: 15px;
  height: 40px;
  line-height: 40px; /* 当没有文字时，高度为0，有文字则自动扩展 */
  background-color: #fff;
}

.tab-control-item {
  /* 设置行内每个元素的样式 */
  flex: 1; /* 每行元素均匀分布 */
}

.tab-control-item span {
  /* 设置单个元素中span标签的样式 */
  padding: 2px; /* 设置单个元素周围的空档 */
}

.active span {
  /* 设置被点击的元素样式 */
  color: var(--color-high-text); /* 被点击元素的文字颜色 */
  border-bottom: 3px solid var(--color-tint); /* 在被点击的文字下面显示划线及颜色 */
}
</style>