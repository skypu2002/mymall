import {debouce} from 'common/utils'
import BackTop from 'components/content/backtop/BackTop'

//把多个组件中重复的代码在此定义
export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null,
    }
  },
  mounted() {
    //对监听事件进行保存
    this.newRefresh = debouce(this.$refs.scroll.refresh, 50)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
    // console.log('this is mixins..........')
  },
}

export const backTopMinxin = {
  data() {
    return {
      isShowBackTop: false,
    }
  },
  components: {
    BackTop,
  },
  methods: {
    backClick() {
      // console.log("backClick: ", this.$refs.scroll.scroll.scrollTo);
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      this.$refs.scroll.scrollTo(0, 0, 500)
    },
  },
}
