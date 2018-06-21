<template>
  <div class="container">
    <el-table :data="orders" border stripe class="orderTable">
      <el-table-column prop="order_id" label="订单id"></el-table-column>
      <el-table-column prop="created_time" label="创建时间"></el-table-column>
      <el-table-column prop="tripInfo" label="航班信息">
        <template slot-scope="scope">
          <p>航班编号：{{scope.row.flight_id}}</p>
          <p>出发时间：{{new Date(scope.row.tripDate).format('YYYY-MM-DD hh:mm')}}</p>
          <p>{{scope.row.departure}} ～ {{scope.row.terminal}}</p>
          <p>价格：{{scope.row.price}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态"></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="payOrder(scope.$index, scope.row)"
                     v-if="scope.row.status==='RESERVED'">立即支付
          </el-button>
          <el-tag v-else>已完成</el-tag>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import Modal_payRequest from './Modal_payRequest'

  export default {
    name   : "orders",
    data() {
      return {
        orders: []
      }
    },
    methods: {
      payOrder(index, row) {
        const h = this.$createElement;
        this.$msgbox({
          title             : '请支付',
          message           : h(Modal_payRequest, {
            props: {
              banks   : [
                {
                  name: 'NTM银行',
                  url : 'http://localhost:3002/order'
                }
              ],
              userInfo: row,
              amount  : row.price
            },
          }),
          customClass       : 'bankBox',
          closeOnClickModal : false,
          closeOnPressEscape: false,
          showConfirmButton : false,
          showCancelButton  : false
        }).catch(e => {
        });
      }
    },
    created() {
      const loading = this.$loading({
        lock      : true,
        text      : '更新中...',
        spinner   : 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.$.ajax.get(`http://localhost:3000/order`).then((res) => {
        this.orders = res;
      }, (err) => {
        this.$message.error('获取失败：' + err.msg);
      }).finally(e => {
        loading.close();
      })
    }
  }
</script>

<style scoped>

</style>
