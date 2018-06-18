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
  let flight_info = await redis.hget(`flight_${payload.flight_id}_info`, 'restTickets');
  if (flight_info && flight_info.restTickets > 0) {
    const sqlStr = 'INSERT INTO orders VALUES (?,?,?,?,?,?,?)';
    const order_id = `${Date.now()}_${payload.user_id}`;
    const user_id = ctx.session.views.user_id;
    const flight_id = payload.flight_id;
    const tripDate = payload.date;
    const price = payload.price;
    const bank_token = null;
    const status = 'RESERVED';
    const msg = '';
    const sqlParams = [order_id, user_id, flight_id, tripDate, price, bank_token, status, msg];
    return new Promise((resolve, reject) => {
      databasePool.query(sqlStr, sqlParams, (error, results) => {
        if (error) {
          resolve(ctx.body = {
            code: 508,
            status: 'FAIL',
            msg: e.msg
          })
        } else {
          resolve({
            code: 200,
            status: 'OK',
            data: {
              order_id
            }
          });
        }
      });
    });
  } else {
    return ctx.body = {
      code: flight_info === 0 ? 408 : 404,
      status: 'FAIL',
      msg: flight_info === 0 ? 'tickets sold out' : 'flight not exist'
    }
  }
}

async function payOrder(ctx) {
  const payload = ctx.request.body;
  const sendMsg = JSON.stringify({
    order_id: payload.order_id,
    bank_brand_id: payload.bank_brand_id,
    bank_token: `${Date.now()}_${payload.user_id}`,
  });
  const sendPayload = {
    topic: kafka.topic,
    messages: sendMsg, // multi messages should be a array, single message can be just a string or a KeyedMessage instance
    key: 'theKey', // string or buffer, only needed when using keyed partitioner
    partition: 0, // default 0
    attributes: 2, // default: 0
    timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
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
  const sqlStr = 'SELECT * FORM orders WHERE user_id = ?';
  const user_id = ctx.session.views.user_id;
  const sqlParams = [user_id];
  return new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
      if (error) {
        resolve(ctx.body = {
          code: 508,
          status: 'FAIL',
          msg: e.msg
        })
      } else {
        resolve({
          code: 200,
          status: 'OK',
          data: {
            orders: results
          }
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