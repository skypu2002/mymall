<template>
  <div id="home">
    <nav-bar class="home_nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
      class="tab-control"
      ref="tabControl1"
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      v-show="isTabFixed"
    />
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pulling-up="true"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <recommend-view :recommends="recommends" />
      <feature-view />
      <tab-control ref="tabControl2" :titles="['流行', '新款', '精选']" @tabClick="tabClick" />
      <goods-list :goods="showGoods" />
    </scroll>
    <!-- 组件无法直接监听原生事件， 须使用修饰符:native 监听一个组件的原生事件，如click, keypress-->
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import NavBar from "components/common/navibar/NaviBar";
import Scroll from "components/common/scroll/Scroll";
import TabControl from "components/content/tabcontrol/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import BackTop from "components/content/backtop/BackTop";

import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import { getHomeData, getHomeGoods } from "network/home";
import { itemListenerMixin } from "common/mixin";

export default {
  name: "Home",
  mixins: [itemListenerMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",
      isShowBackTop: true,
      tabControlOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,
      // itemImgListener: null, //记录监听事件函数, 用mixin
    };
  },
  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  components: {
    NavBar,
    TabControl,
    GoodsList,
    HomeSwiper,
    RecommendView,
    FeatureView,
    Scroll,
    BackTop,
  },
  created() {
    //在组件加载完成后请求网络数据
    this.getHomeData();
    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
    //监听图片是否加载事件
    //不能在created中监听，因为此时$refs可能为null
    // this.$bus.$on("itemImageLoad", () => {
    //   console.log("itemImageLoad from Home created.....");
    //   this.$refs.scroll.refresh();
    // });
  },
  mounted() {
    //手工代码点击一次tabcontrol
    //此方法不要在created中调用，避免tabControl尚未加载完成导致undefined错误
    this.tabClick(0);
    //mounted中监听图片是否加载事件，确保元素都已经加载完毕
    //以下这个方法存在频繁调用的问题，可以用防抖函数debouce优化
    //注意: 传入函数不能带(),否则就变成执行此函件了！！
    //     refresh虽然是局部变量，但由于是用在闭包中，不会被销毁
    /** 
     * 采用mixins处理方式抽取和混入重复代码（见详情页）
     * mixins: 先import ，再定义mixins数组, 最后删除重复代码
     * 
    const newRefresh = debouce(this.$refs.scroll.refresh, 50);
    //对监听事件进行保存
    this.itemImgListener = () => {
      newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    */
    //获取tabControl 的offsettop的值
    //所有的组件都有一个属性$el: 用于获取组件中的子元素
    // this.$refs.tabControl.$el.offsetTop
    //但在这里获取的值是不正确的，因为其他组件的图片尚未加载
    // console.log("tabControl.offsetTop: ", this.$refs.tabControl.$el.offsetTop);
  },
  activated() {
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh(); //用refresh来避免bug
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY;
    //取消全局事件的监听（因为goodslistitem组件在详情页面中也有使用，从而导致相同的监听事件被触发）
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
  methods: {
    // /**
    //  * 防抖函数： 传入函数、延时时间
    //  * 用于解决某些方法被频繁的调用，提供性能
    //  * 并抽离成公用函数进行调用
    //  */
    // debouce(func, delay) {
    //   let timer = null;
    //   return function (...args) {
    //     if (timer) clearTimeout(timer);

    //     timer = setTimeout(() => {
    //       func.apply(this, args);
    //     }, delay);
    //   };
    // },
    //网络请求相关的方法
    //主页的多种数据
    getHomeData() {
      getHomeData().then((res) => {
        // console.log('res from getHomeData: ', res)
        this.banners = res.data.data.banner.list;
        this.recommends = res.data.data.recommend.list;
      });
    },

    //请求主页的商品数据
    getHomeGoods(type) {
      // const currentPage = this.goods[type].page + 1;
      getHomeGoods(type, this.goods[type].page + 1).then((res) => {
        // console.log('res from getHomeGoods: ', res)
        this.goods[type].list.push(...res.data.data.list);
        this.goods[type].page++; //准备请求下个page

        this.$refs.scroll.finishPullUp();
      });
    },

    /*
      事件相关的处理方法
    */
    tabClick(index) {
      // console.log("index from tab click: ", index);
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }

      //让两个tabcontrol选中的item保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    // backTop click
    backClick() {
      // console.log("backClick: ", this.$refs.scroll.scroll.scrollTo);
      // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      //to-do: scrollTo无法正确执行
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    //监听滚动事件处理
    contentScroll(position) {
      // console.log("contentScroll form Home.vue ");
      // console.log("position from Home.vue: ", position);
      //判断backtop是否显示
      this.isShowBackTop = -position.y > 100;

      //判断tabcontrol是否吸顶(position: fixed)
      this.isTabFixed = -position.y > this.tabControlOffsetTop;
    },

    // //滚动到底部加载更多
    loadMore() {
      console.log("loadMore form Home.vue ");
      this.getHomeGoods(this.currentType);
      // //确保加载完后，用refresh来重新计算scroll的可滚动高度和宽度
      // this.$refs.scroll.refresh();
    },
    swiperImageLoad() {
      // console.log("swiperImageLoad from Home.vue");
      // console.log(
      //   "tabControl.offsetTop: ",
      //   this.$refs.tabControl.$el.offsetTop
      // );
      //获取图片加载完成后tabControl的位置
      this.tabControlOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      //监听滚动，根据位置来修改tabControl的样式
    },
  },
};
</script>

<style scoped>
/* scoped使得以下css样式只针对本文件的内容 */
#home {
  /* padding-top: 44px; */
  /* vh:viewport height : 屏幕可见的高度 */
  height: 100vh;
  position: relative;
}

.home_nav {
  background-color: var(--color-tint);
  color: white;

  /* 禁止导航条滚动 */
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}

.tab-control {
  /* stick属性可以控制元素默认是可以滚动的，当在滚动到指定位置时则变成fixed，则停留
    主要支持新版浏览器和移动端，IE则不支持

    当使用了better-scroll后，sticky属性会无效
  */
  /* position: sticky; */
  /* top: 44px;
  box-shadow: 0 1px 1px rgba(100, 100, 100, 0.2);
  z-index: 9; 如果被其他滚动元素覆盖，则可以通过设置z-index将当前元素放在上一层 */
  position: relative;
  z-index: 9;
  margin-top: 44px;
}

.content {
  /* 滚动区域的设置有2种方法，一种使用calc来计算位置，但无法滚动*/
  /* calc: CS函数，用于计算 */
  /* height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 44px; */
  /* 另一种方法是设置绝对位置来设置 */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}
</style>
