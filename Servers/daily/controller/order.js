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
  //validate request
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) return ctx.throw(400);
  //find rest of seats in cache
  let flight_info = await redis.hget(`flight_${payload.id}_info`, 'restTickets');
  if (flight_info && flight_info.restTickets > 0) {
    const sendMsg = JSON.stringify({
      flight_id: payload.flight_id,
      order_req: `${Date.now()}_${payload.user_id}`,
    });
    //todo 重做
    const sendPayload = {
      topic: kafka.topic,
      messages: sendMsg, // multi messages should be a array, single message can be just a string or a KeyedMessage instance
      key: 'theKey', // string or buffer, only needed when using keyed partitioner
      partition: 0, // default 0
      attributes: 2, // default: 0
      timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
    };
    MQProducer.send(sendPayload, (err, data) => {
      //reduce rest of tickets
      redis.hincrby(`flight_${payload.id}_info`, 'restTickets', '-1');
      ctx.body = {
        code: 200,
        status: 'OK',
        data: null
      };
    })
  } else {
    return ctx.body = {
      code: flight_info === 0 ? 408 : 404,
      status: 'FAIL',
      msg: flight_info === 0 ? 'tickets sold out' : 'flight not exist'
    }
  }
}

/*查看订单*/
async function checkOrders(ctx) {

}

module.exports = {
  takeOrders,
  checkOrders
};