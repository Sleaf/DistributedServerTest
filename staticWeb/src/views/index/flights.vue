<template>
  <div>
    <!--日期选择器-->
    <div>
      <span>选择出行时间：</span>
      <el-date-picker class="datePicker" type="date" placeholder="选择日期"
                      v-model="pickedDate" :picker-options="pickerOptions"
                      @change="updateFlights">
      </el-date-picker>
    </div>
    <!--航班表-->
    <el-table :data="flights" border stripe class="flightTable">
      <el-table-column prop="flight_id" label="航班ID"></el-table-column>
      <el-table-column prop="tripDate" label="出发时间"></el-table-column>
      <el-table-column prop="flight_brand_name" label="航空公司"></el-table-column>
      <el-table-column prop="model" label="机型"></el-table-column>
      <el-table-column prop="departure" label="始发站"></el-table-column>
      <el-table-column prop="terminal" label="终点站"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="bookTicket(scope.$index, scope.row)">立即订票</el-button>
          <span class="center">当前剩余 {{scope.row.restTickets}} 张</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name   : "detail",
    data() {
      return {
        pickedDate   : new Date(),
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 24 * 3600 * 1000
              && time.getTime() > Date.now() + 30 * 24 * 3600 * 1000;
          },
        },
        flights      : [
          // {
          //   "flight_id": '123',
          //   "tripTime": '123123',
          //   "brand": 'boyin',
          //   "departure": 'sh',
          //   "terminal": 'bk',
          //   "restTickets": 20
          // }
        ]
      }
    },
    methods: {
      updateFlights() {
        const loading = this.$loading({
          lock      : true,
          text      : '更新中...',
          spinner   : 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$.ajax.get(`http://localhost:3000/scan?date=${this.pickedDate.format('YYYY-MM-DD')}`).then((res) => {
          this.flights = res;
        }, (err) => {
          this.$message.error('获取失败：' + err.msg);
        }).finally(e => {
          loading.close();
        })
      },
      bookTicket(index, row) {
        if (sessionStorage.sessionID === undefined) {
          this.$message.warning('请先登录');
          this.$router.push('/login');
          return;
        }
        const loading = this.$loading({
          lock      : true,
          text      : '更新中...',
          spinner   : 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$.ajax.post(`http://localhost:3000/order`, JSON.stringify({
          flight_id: row.flight_id,
          user_id  : sessionStorage.user_id,
          date     : this.pickedDate.format('YYYY-MM-DD'),
          price    : row.price,
        })).then((res) => {
          //todo 处理订单
        }, (err) => {
          this.$message.error('获取失败：' + err.msg);
        }).finally(e => {
          loading.close();
        })
      }
    },
    mounted() {

    },
    created() {
      this.updateFlights()
    }
  }
</script>

<style lang="stylus" scoped>
  .datePicker
    cursor pointer
    margin 2em 0

  .flightTable
    width 100%
    text-align center
</style>
