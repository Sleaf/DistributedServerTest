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
      <el-table-column prop="model" label="品牌"></el-table-column>
      <el-table-column prop="departure" label="始发站"></el-table-column>
      <el-table-column prop="terminal" label="终点站"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="removeFlight(scope.$index, scope.row)">取消航班</el-button>
          <span class="center">当前剩余 {{scope.row.restTickets}} 张</span>
        </template>
      </el-table-column>
    </el-table>
    <!--新建航班-->
    <el-form class="newInputFrom" ref="newFlight" :model="newFlight" label-width="80px">
      <p>新增航班</p>
      <el-date-picker class="newInput" v-model="newFlight.tripDateTime" type="datetime"
                      placeholder="请选择出发时间"></el-date-picker>
      <el-input class="newInput" placeholder="机型" v-model="newFlight.model"></el-input>
      <el-input class="newInput" placeholder="始发站" v-model="newFlight.departure"></el-input>
      <el-input class="newInput" placeholder="终点站" v-model="newFlight.terminal"></el-input>
      <el-input class="newInput" placeholder="价格" v-model="newFlight.price"></el-input>
      <el-input class="newInput" placeholder="机票余量" v-model="newFlight.restTickets"></el-input>
      <el-button class="newInput" type="primary" @click="submit">提交</el-button>
    </el-form>
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
          //   "model": 'boyin',
          //   "departure": 'sh',
          //   "terminal": 'bk',
          //   "restTickets": 20
          // }
        ],
        newFlight    : {
          tripDateTime: '',
          model       : '',
          departure   : '',
          terminal    : '',
          price       : '',
          restTickets : ''
        }
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
        this.$.ajax.get(`http://localhost:3001/info?date=${this.pickedDate.format('YYYY-MM-DD')}`).then((res) => {
          this.flights = res;
        }, (err) => {
          this.$message.error('获取失败：' + err.msg);
        }).finally(e => {
          loading.close();
        })
      },
      submit() {
        const loading = this.$loading({
          lock      : true,
          text      : '更新中...',
          spinner   : 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const payload = this.newFlight;
        payload.tripDate = new Date(payload.tripDateTime).format('YYYY-MM-DD');
        payload.tripTime = new Date(payload.tripDateTime).format('hh:mm:ss');
        this.$.ajax.post('http://localhost:3001/info', JSON.stringify(payload)).then(res => {
          this.$message.success('添加成功');
          if (this.pickedDate.getDate() === new Date().getDate()) {
            this.flights.push({
              ...payload,
              flight_id: '（刷新后显示）'
            });
          }
        }, e => {
          this.$message.error('添加失败');
        }).finally(e => {
          loading.close();
        })
      },
      removeFlight() {
        this.$message.error('暂不允许');
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

  .newInputFrom
    margin 2em 0 0 0
    .newInput
      width 13%
</style>
