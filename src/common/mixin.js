import {debounce} from 'common/utils'

export const itemListenerMixin = {
  //把多个组件中重复的代码在此定义
  data() {
    return {
      itemImgListener: null,
      newRefresh: null,
    }
  },
  mounted() {
    //对监听事件进行保存
    this.newRefresh = debounce(this.$refs.scroll.refresh, 50)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('this is mixins..........')
  },
}
