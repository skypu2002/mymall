<template>
  <div class="toast" v-show="isShow">
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  data() {
    return {
      //插件方式定义的变量
      message: '',
      isShow: false,
    }
  },
  props: {
    //普通方式使用以下属性，插件方式则在data中定义
    // message: {
    //   type: String,
    //   default: '',
    // },
    // isShow: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    show(message, duration = 2000) {
      this.isShow = true
      this.message = message

      setTimeout(() => {
        this.isShow = false
        this.message = ''
      }, duration)
    },
  },
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 设置居中  */
  padding: 8px 8px 10px 10px;
  z-index: 999; /* 如有必要，总是设置在最上层 */

  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
