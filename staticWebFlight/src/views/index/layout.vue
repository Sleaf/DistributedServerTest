<template>
  <el-container>
    <!--title-->
    <el-header height="4em">
      <h1 class="title untouchable">NTM航空后台</h1>
    </el-header>
    <el-container>
      <!--nav-->
      <el-aside width="13em">
        <el-menu :collapse="collapseNav" :default-openeds="['school','organization','research']">
          <!--学校管理-->
          <el-submenu index="school">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>菜单</span>
            </template>
            <router-link to="flights">
              <el-menu-item index="flights">
                所有航班
              </el-menu-item>
            </router-link>
          </el-submenu>
        </el-menu>
        <el-button class="btn_logout" type="danger" @click="logout" v-if="logged">
          <i class="el-icon-back"></i>
          &#12288;退出登录
        </el-button>
        <router-link to="/login" v-else>
          <el-button class="btn_logout" type="primary" >
            <i class="el-icon-info"></i>
            &#12288;登录
          </el-button>
        </router-link>
      </el-aside>
      <!--Main-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    <!--footer-->
    <el-footer class="untouchable" height="3em">
      Design By sleaf
    </el-footer>
  </el-container>
</template>

<script>
  export default {
    name: 'layout',
    data() {
      return {
        collapseNav: false,
        logged: false
      }
    },
    computed: {},
    created() {

    },
    mounted() {
      this.logged = sessionStorage.sessionID
    },
    methods: {
      logout() {
        this.$router.push('/login');
        this.$message.success('退出成功');
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .el-container
    width 100%
    height 100%
    padding 0
    margin 0

  .el-header, .el-footer
    background-color: #B3C0D1
    color: #333
    line-height: 2em
    .logo
      height 3em
      margin .5em
      border-radius 1em
    .title
      white-space nowrap
      text-overflow ellipsis
      overflow hidden

  .el-aside
    display flex
    flex-direction: column
    justify-content space-between
    color: #333
    text-align: left
    background-color: #E9EEF3
    .btn_logout
      margin 1em 2em 1em 2em
      width 10em

  .fullscreen-btn
    position fixed
    left 15em
    width 2em

  .el-main
    color: #333
    text-align left
    height 100% -7em

  .el-footer
    text-align center
    line-height: 3em

</style>
