module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport': {
      viewportWidth: 375, //视窗宽度. iPhone6
      viewportHeight: 667, //视窗高度,iPhone6
      unitPrecision: 5, //转换后的小数位精度
      viewportUnit: 'vw', //指定要转换的单位，如vw, rem等
      selectorBlackList: ['ignore', 'tab-bar'], //不需要转换的类
      minPixelValue: 1, //<=1px不转换
      mediaQuery: false, //允许在媒体查询中转换px
      exclude: [/TabBar/], //使用正则表达式
    },
  },
}
