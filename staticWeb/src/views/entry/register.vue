<template>
  <div class="container">
    <el-form class="registerFrom" :model="registerFrom" status-icon :rules="registerFromRule" ref="registerFrom">
      <div class="center">
        <h2>加入NTM辅导！</h2>
      </div>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="registerFrom.username" placeholder="用户名..."></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="registerFrom.password" placeholder="密码..."></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="registerFrom.checkPass" placeholder="确认密码..."></el-input>
      </el-form-item>
      <el-form-item class="submit-item">
        <el-button style="width: 100%" size="large" type="primary" @click="submitForm('registerFrom')">
          立即注册
        </el-button>
        <router-link id="toLogin-btn" to="login">
          <div>返回登录</div>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "register_st",
    data() {
      return {
        registerFrom: {
          username: '',
          password: '',
          checkPass: ''
        },
        registerFromRule: {
          username: [{
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入用户名'));
              } else {
                callback();
              }
            },
            trigger: 'blur'
          }],
          password: [{
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请输入密码'));
              } else {
                if (this.registerFrom.checkPass !== '') {
                  this.$refs.registerFrom.validateField('checkPass');
                }
                callback();
              }
            },
            trigger: 'blur'
          }],
          checkPass: [{
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'));
              } else if (value !== this.registerFrom.password) {
                callback(new Error('两次输入密码不一致!'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$.ajax.post('/register', {
              username: this.registerFrom.username,
              password: this.registerFrom.password
            }).then((res) => {
              this.$message.success('注册成功！');
              this.$router.push('/login')
            }, (err) => {
              this.$message.error('注册失败：' + err.message)
            })
          }
        });
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    display flex
    align-items center
    justify-content center

  #toLogin-btn
    color black
    width 100%
    text-align center

  .submit-item
    margin-top 1em
</style>
