<template>
  <div id="detail" class="detail-nav">
    <detail-nav-bar @titleClick="titleClick" ref="navbar" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 属性:topImages 传入：top-images, 因为在html中属性不区分大小写 -->
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-image-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :paramInfo="paramInfo" />
      <detail-comment-info ref="comment" :commentInfo="commentInfo" />
      <goods-list ref="recommend" :goods="recommendInfo" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart" />
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailImageInfo from './childComps/DetailImageInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'
import GoodsList from 'components/content/goods/GoodsList'

import Scroll from 'components/common/scroll/Scroll'

import {itemListenerMixin, backTopMinxin} from 'common/mixin'
import {debouce} from 'common/utils'
import {POP, NEW, SELL, BACKTOP_DISTANCE} from 'common/const.js'

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from 'network/detail'

export default {
  name: 'Detail',
  mixins: [itemListenerMixin, backTopMinxin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendInfo: [],
      // itemImgListener: null,  用mixin
      themeTopYs: [],
      getThemeTopY: null,
      tabCurrentIndex: 0,
    }
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImageInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
  },
  created() {
    this.iid = this.$route.params.iid

    //根据iid获取商品详情数据
    getDetail(this.iid).then((res) => {
      const data = res.data.result
      console.log('iid商品数据: ', data)
      //获取顶部轮播图top-image
      this.topImages = data.itemInfo.topImages
      // console.log("topImages: ", this.topImages);
      //获取商品基本信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // console.log("goods: ", this.goods);
      //获取商家信息
      this.shop = new Shop(data.shopInfo)
      //获取商品详细信息
      this.detailInfo = data.detailInfo
      //获取商品参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //获得评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      /*
      this.$nextTick(() => {
        //此代码不能在mounted中调用，因为此时组件的数据尚未加载
        //也不能在created中，因为此时组件元素尚未加载完成
        //但可以在updated执行，不过会频繁更新
        //推荐在nextTick中执行，确保数据和元素都已经加载和渲染完毕回调执行一次
        //注意：此时仅仅是根据最新的数据把对应的dom渲染完成，而图片依然没有加载完毕！！！
        //所以获取的offsetTop并没有保存图片的高度

        //获取每个主题的offsetTop
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log("themeTopYs: ", this.themeTopYs);

       //！！！！鉴于nextTick也无法获取正确的offsetTop值，推荐在imageLoad中来获取
      });
        */
    })

    //请求推荐商品（与某个商品无关）
    getRecommend().then((res) => {
      // console.log("getRecommend: ", res);
      this.recommendInfo = res.data.data.list
    })

    //用防抖来处理获取offsetTop的值
    this.getThemeTopY = debouce(() => {
      //获取每个主题的offsetTop
      //直接获取则会频繁执行，需要做防抖处理
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopYs.push(Number.MAX_VALUE) //用于tab和内容联动处理
      // console.log("themeTopYs: ", this.themeTopYs);
    })
  },
  methods: {
    imageLoad() {
      //防抖的优化方式，可以直接call mixins的newRefresh
      this.newRefresh()
      // console.log("mixins newRefresh ....... ");

      //原先的优化方式
      // this.$refs.scroll.refresh();

      //使用防抖方法来获取每个主题的offsetTop
      this.getThemeTopY()
    },
    titleClick(index) {
      // console.log("titleClick: ", index);
      // 注意，y轴的数值是负数
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500)
    },
    contentScroll(position) {
      // console.log("position: ", position);
      //获取y值
      const posY = -position.y

      //和主题themeTopYs的offsetY进行对比
      let length = this.themeTopYs.length
      for (let i = 0; i < length - 1; i++) {
        if (this.tabCurrentIndex !== i && posY >= this.themeTopYs[i] && posY < this.themeTopYs[i + 1]) {
          this.tabCurrentIndex = i
          this.$refs.navbar.currentIndex = this.tabCurrentIndex
        }
      }

      this.isShowBackTop = -position.y > BACKTOP_DISTANCE
    },
    addToCart() {
      // console.log("addToCart....");
      //获取商品的主要信息加入购物车
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //加入购物车
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product)
    },
  },
  mounted() {
    // console.log("mounted=====");
    /**
    //对监听事件进行保存
    const newRefresh = debouce(this.$refs.scroll.refresh, 50);
    this.itemImgListener = () => {
      newRefresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
    //注意，这段监听处理的代码和Home.vue中的代码是完全一样的（包括deactive中的取消事件处理
    // 所以需要使用mixin来进行重复代码的抽取和重用
    */
    //mixins: 先import ，再定义mixins数组, 最后删除重复代码
  },
  destroyed() {
    //由于Detail页面没有做keep-alive，所以没有deactive事件，需要在destory中处理
    //取消全局事件的监听（因为goodslistitem组件在详情页面中也有使用，从而导致相同的监听事件被触发）
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
}
</script>
<style scoped>
#detail {
  /* 以下设置可以使得detail页面覆盖住底部的主菜单栏 */
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  /* height: calc(100% - 93px); */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>
