<template>
  <div id="app" class="container untouchable">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data() {
      return {};
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {}
  };
</script>
<style lang="stylus">
  #app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale

  *
    font-family "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif

  html, body, #app
    width 100%
    height 100%

  body
    margin 0
    padding 0

  a
    text-decoration none
    color black

  .untouchable
    -webkit-touch-callout none
    -webkit-user-select none
    -moz-user-select none
    -ms-user-select none
    user-select none

  .left
    display inline
    float left

  .right
    display inline
    float right

  .center
    clear both
    display block
    margin auto
    text-align center

</style>
