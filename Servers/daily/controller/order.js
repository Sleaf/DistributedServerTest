const databasePool = require('../store/database');
const redis = require('../store/cache');
const kafka = require('../store/messageQueue');

//producer
const MQProducer = new kafka.Producer(kafka.client);
MQProducer.on('ready', function () {
  // console.log('Producer is ready');
  const topics = [kafka.topic];
  MQProducer.createTopics(topics, true, function (err, data) {
    console.log(`topic [${topics}] created`);
  });
});
MQProducer.on('error', function (err) {
  console.log('Producer is in error state');
  console.log(err);
});

/*发起订单*/
async function takeOrders(ctx) {
  const payload = ctx.request.body;
  //find rest of seats in cache
  let flight_restTickets = await redis.hget(`flights_${payload.flight_id}_info`, 'restTickets');
  console.log(payload.flight_id, '号航班剩余票数：', flight_restTickets);
  if (Number(flight_restTickets) > 0) {
    const sqlStr = 'INSERT INTO orders (order_id, user_id, flight_id, tripDate, price, bank_brand_id, bank_token, status, msg) VALUES (?,?,?,?,?,?,?,?,?)';
    const user_id = ctx.session.views.user_id;
    const order_id = `${Date.now()}_${user_id}`;
    const flight_id = payload.flight_id;
    const tripDate = payload.date;
    const price = payload.price;
    const bank_brand_id = null;
    const bank_token = null;
    const status = 'RESERVED';
    const msg = '';
    const sqlParams = [order_id, user_id, flight_id, tripDate, price, bank_brand_id, bank_token, status, msg];
    return new Promise((resolve, reject) => {
      databasePool.query(sqlStr, sqlParams, (error, results) => {
        if (error) {
          console.error(error);
          resolve(ctx.body = {
            code  : 508,
            status: 'FAIL',
            msg   : '数据库内部错误：' + error.msg
          })
        } else {
          resolve(ctx.body = {
            code  : 200,
            status: 'OK',
            data  : {
              order_id
            }
          });
        }
      });
    });
  } else {
    return ctx.body = {
      code  : flight_restTickets === 0 ? 408 : 404,
      status: 'FAIL',
      msg   : flight_restTickets === 0 ? 'tickets sold out' : 'flight not exist'
    }
  }
}

async function payOrder(ctx) {
  const payload = ctx.request.body;
  const sendMsg = JSON.stringify({
    order_id     : payload.order_id,
    bank_brand_id: payload.bank_brand_id,
    bank_token   : `${Date.now()}_${payload.user_id}`,
  });
  const sendPayload = {
    topic     : kafka.topic,
    messages  : sendMsg, // multi messages should be a array, single message can be just a string or a KeyedMessage instance
    key       : 'theKey', // string or buffer, only needed when using keyed partitioner
    partition : 0, // default 0
    attributes: 2, // default: 0
    timestamp : Date.now() // <-- defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
  };
  MQProducer.send(sendPayload, (err, data) => {
    //todo 检查付款状态
    //减少库存量
    // redis.hincrby(`flight_${payload.id}_info`, 'restTickets', '-1');
    // ctx.body = {
    //   code: 200,
    //   status: 'OK',
    //   data: null
    // };
  })
}

/*查看订单*/
async function checkOrders(ctx) {
  const sqlStr = 'SELECT DISTINCT * FROM orders,flights WHERE orders.user_id = ? AND orders.flight_id = flights.flight_id';
  const user_id = ctx.session.views.user_id;
  // console.log('查询用户订单：', user_id);
  if (!user_id) return ctx.throw(403);
  const sqlParams = [user_id];
  return new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
      if (error) {
        console.log(error);
        resolve(ctx.body = {
          code  : 508,
          status: 'FAIL',
          msg   : '数据库内部错误：' + error.msg
        })
      } else {
        resolve(ctx.body = {
          code  : 200,
          status: 'OK',
          data  : results
        });
      }
    });
  })
}

module.exports = {
  takeOrders,
  payOrder,
  checkOrders
};