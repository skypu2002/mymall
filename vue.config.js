module.exports = {
  //配置项目的别名
  configureWebpack: {
    resolve: {
      // extenstions: [],  //通常不需要配置
      alias: {
        //@ 已经默认配置完成
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        network: '@/network',
        //router不需要配置，直接用this.$router
        //同理，store也不需要，用this.$store
        views: '@/views',
      },
    },
  },
}
