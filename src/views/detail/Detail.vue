<template>
  <div id="detail" class="detail-nav">
    <detail-nav-bar />
    <scroll class="content" ref="scroll">
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-image-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info :paramInfo="paramInfo" />
      <detail-comment-info :commentInfo="commentInfo" />
      <goods-list :goods="recommendInfo" />
    </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailImageInfo from "./childComps/DetailImageInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import GoodsList from "components/content/goods/GoodsList";

import Scroll from "components/common/scroll/Scroll";

import { itemListenerMixin } from "common/mixin";

import {
  getDetail,
  getRecommend,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail";

export default {
  name: "Detail",
  mixins: [itemListenerMixin],
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
    };
  },
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailImageInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList,
  },
  created() {
    this.iid = this.$route.params.iid;

    //根据iid获取商品详情数据
    getDetail(this.iid).then((res) => {
      const data = res.data.result;
      console.log("iid商品数据: ", data);
      //获取顶部轮播图top-image
      this.topImages = data.itemInfo.topImages;
      // console.log("topImages: ", this.topImages);
      //获取商品基本信息
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // console.log("goods: ", this.goods);
      //获取商家信息
      this.shop = new Shop(data.shopInfo);
      //获取商品详细信息
      this.detailInfo = data.detailInfo;
      //获取商品参数信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );
      //获得评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }
    });

    //请求推荐商品（与某个商品无关）
    getRecommend().then((res) => {
      // console.log("getRecommend: ", res);
      this.recommendInfo = res.data.data.list;
    });
  },
  methods: {
    imageLoad() {
      //防抖的优化方式，可以直接call mixins的newRefresh
      this.newRefresh();
      // console.log("mixins newRefresh ....... ");

      //原先的优化方式
      // this.$refs.scroll.refresh();
    },
  },
  mounted() {
    // console.log("mounted=====");
    /**
    //对监听事件进行保存
    const newRefresh = debounce(this.$refs.scroll.refresh, 50);
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
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
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