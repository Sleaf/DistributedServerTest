<template>
  <div class="container">
    <p>支付金额：{{amount}}</p>
    <div style="margin: 1em">
      <span>请选择银行：</span>
      <el-select v-model="selectedBankURL" placeholder="请选择...">
        <el-option v-for="bank in banks" :key="bank.url" :label="bank.name" :value="bank.url">
        </el-option>
      </el-select>
    </div>
    <el-form label-position="right" label-width="80px" :model="bankAccount">
      <el-form-item label="用户名">
        <el-input v-model="bankAccount.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="bankAccount.password"></el-input>
      </el-form-item>
      <el-button class="newInput" type="primary" @click="getBankToken">立即支付</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    name   : "Modal_payRequest",
    props  : {
      userInfo: {
        type   : Object,
        default: _ => ({})
      },
      banks   : {
        type   : Array,
        default: () => [],
      },
      amount  : {
        type   : Number,
        default: -1
      },
    },
    data() {
      return {
        selectedBankURL: '',
        bankAccount    : {
          username: '',
          password: ''
        },
      };
    },
    methods: {
      getBankToken() {
        const loading = this.$loading({
          lock      : true,
          text      : '支付中...',
          spinner   : 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$.ajax.post(this.selectedBankURL, JSON.stringify(this.userInfo)).then((res) => {
          console.log(res);
          //todo 处理返回的token
        }, (err) => {
          this.$message.error('支付失败：' + err.msg);
        }).finally(e => {
          loading.close();
        });
      }
    },
  }
</script>

<style scoped>

</style>
