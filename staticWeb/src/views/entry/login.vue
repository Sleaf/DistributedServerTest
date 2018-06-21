<template>
  <div class="container">
    <el-card class="box-card">
      <el-form class="loginFrom" :model="loginFrom" status-icon :rules="loginFromRule" ref="loginFrom">
        <div class="center">
          <div style="font-weight: bold;text-align: center;font-size: 1.5em">登录NTM去哪儿</div>
        </div>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="loginFrom.username" placeholder="用户名..."></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="loginFrom.password" placeholder="密码..."></el-input>
        </el-form-item>
        <el-form-item class="submit-item">
          <el-button style="width: 100%" size="large" type="primary"
                     @click="submitForm('loginFrom')">
            立即登录
          </el-button>
        </el-form-item>
        <router-link class="center" to="/register">点我去注册</router-link>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    name   : "login",
    data() {
      return {
        loginFrom    : {
          username: '',
          password: '',
        },
        loginFromRule: {
          username: [{
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入用户名'));
              } else {
                callback();
              }
            },
            trigger  : 'blur'
          }],
          password: [{
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else {
                callback();
              }
            },
            trigger  : 'blur'
          }],
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const loading = this.$loading({
              lock      : true,
              text      : '登录中...',
              spinner   : 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.$.ajax.post(`/api/login`, JSON.stringify({
              username: this.loginFrom.username,
              password: this.loginFrom.password
            })).then((res) => {
              this.$message.success('登录成功');
              sessionStorage.user_id = res.user_id;
              sessionStorage.sessionID = res.sessionID;
              this.$router.push('/');
            }, (err) => {
              this.$message.error('登录失败：' + err.msg)
            }).finally(() => {
              loading.close();
            })
          }
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    width 100%
    height 100%
    display flex
    align-items center
    justify-content center
    background-size: 100px 100px;
    background-image: linear-gradient(45deg, skyblue 25%, transparent 25%, transparent),
      linear-gradient(-45deg, skyblue 25%, transparent 25%, transparent),
      linear-gradient(45deg, transparent 75%, skyblue 75%),
      linear-gradient(-45deg, transparent 75%, skyblue 75%);
    .box-card
      padding 1em

  .toRegister-btn
    color black
    width 100%
    text-align center

  .submit-item
    margin-top 2em
</style>
