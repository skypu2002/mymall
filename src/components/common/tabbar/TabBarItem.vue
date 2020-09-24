<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <!-- 注意，文字的class不能直接设置在slot中，会被替换掉而无效，需要在上层增加div标签，再进行设置-->
    <div :style="activeStyle">
      <slot name="item-text"></slot>
      </div>
  </div>
 </template>

<script>
  export default {
    name: "TabBarItem",
    props: {
      link: String,
      activeColor: {
        type: String,
        default: 'red'
      }
    },
    computed: {
      isActive() {
        return this.$route.path.indexOf(this.link) != -1
      },
      activeStyle() {
        return this.isActive ? {color: this.activeColor, fontWeight: 'bold'} : {}
      }
    },
    data() {
      return {
        //isActive: false
      }
    },
    methods: {
      itemClick() {
        //console.log('itemClick')
        this.$router.replace(this.link)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item {
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 12px;
  }
  
  .tab-bar-item img {
    width: 30px;
    height: 30px;
    margin-top: 2px;
    vertical-align: middle;
  }

</style>