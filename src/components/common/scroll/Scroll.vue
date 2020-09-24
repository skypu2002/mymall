<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullingUp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    //用document.querySelector('.warpper')来获取DOM对象不是最好的方法，容易重名
    // this.scroll = new BScroll(document.querySelector('.warpper'), {})
    //在DOM用ref来绑定更佳(没有重名风险):
    //如果ref是绑定在组件中的，可通过this.$refs.{refname}获取到一个组件对象
    //如果ref是绑定在普通的元素的，可通过this.$refs.{refname}获取到一个元素对象，和querySelector作用相同

    //这里的 this.$nextTick 是一个异步函数，为了确保 DOM 已经渲染，它的底层用到了 MutationObserver
    //或者是 setTimeout(fn, 0)。其实我们在这里把 this.$nextTick 替换成 setTimeout(fn, 20) 也是可以的（20 ms 是一个经验值，每一个 Tick 约为 17 ms），对用户体验而言都是无感知的。
    this.$nextTick(() => {
      // console.log("probeType1: ", this.probeType);
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType, //侦测滚动的位置
        pullUpLoad: this.pullingUp, //触发时机：当底部下拉距离超过阈值
        // pullUpLoad: true, //上拉到底部时触发
        click: true, //BetterScroll 默认会阻止浏览器的原生 click 事件。当设置为 true，BetterScroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
      });
      // this.scroll.scrollTo(0, 0);
      //监听滚动事件，确保probeType: 3
      if (this.probeType === 2 || this.probeType === 3) {
        this.scroll.on("scroll", (position) => {
          // console.log("position: ", position);
          this.$emit("scroll", position);
        });
      }

      // 监听滚动到底部上拉的事件
      //to-do:无法执行pullingUp！！！
      if (this.pullingUp) {
        this.scroll.on("pullingUp", () => {
          console.log("监听滚动到底部上拉的事件 ");
          this.$emit("pullingUp");
        });
      }
    });
  },
  methods: {
    scrollTo(x, y, time = 300) {
      // console.log("scrollTo: from Scroll.vue meathods");
      this.scroll && this.scroll.scrollTo(x, y, time);
      // this.scroll.scrollTo(x, y, time);
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    refresh() {
      // console.log("refresh from Scroll.vue");
      this.scroll && this.scroll.refresh();
    },
    getScrollY() {
      this.scroll ? this.scroll.y : 0;
    },
  },
};
</script>
<style scoped></style>
