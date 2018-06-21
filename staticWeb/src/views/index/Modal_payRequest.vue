<template>
  <div class="container">
    <p>支付金额：{{amount}}</p>
    <div>
      <span>请选择银行：</span>
      <el-select v-model="selectedBank" placeholder="请选择...">
        <el-option v-for="bank in banks" :key="bank.value" :label="bank.label" :value="bank.value">
        </el-option>
      </el-select>
    </div>
    <el-form :label-position="right" label-width="80px" :model="bankAccount">
      <el-form-item label="用户名">
        <el-input v-model="bankAccount.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="bankAccount.password"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name : "Modal_payRequest",
    props: {
      banks : {
        type   : Array,
        default: () => [],
      },
      amount: {
        type   : Number,
        default: -1
      },
    },
    data() {
      return {
        bankAccount: {
          username: '',
          password: ''
        },
      };
    },
  }
</script>

<style scoped>

</style>
