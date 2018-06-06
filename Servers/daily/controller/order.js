const databasePool = require('../store/database');
const redis = require('../store/cache');
const kafka = require('../store/messageQueue');

/*发起订单*/
async function launch(ctx) {
  const payload = ctx.request.body;
  //validate request
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) return ctx.throw(400);
  //find rest of seats in cache
  let flight_info = await redis.hget(`flight_${payload.id}_info`);
  if (flight_info && flight_info.restTickets > 0) {
    const sendMsg = JSON.stringify({
      id: payload.id,
      username: payload.username
    });
    const sendPayload = {
      topic: 'Posts',
      messages: sendMsg, // multi messages should be a array, single message can be just a string or a KeyedMessage instance
      key: 'theKey', // string or buffer, only needed when using keyed partitioner
      partition: 0, // default 0
      attributes: 2, // default: 0
      timestamp: Date.now() // <-- defaults to Date.now() (only available with kafka v0.10 and KafkaClient only)
    };
    kafka.producer.send(sendPayload, (err, data) => {
      //reduce rest of tickets
      redis.hincrby(`flight_${payload.id}_rest restTickets -1`);
      console.log(data);
    })
  } else {
    ctx.body = {
      code: 'FAIL',
      msg: flight_info === 0 ? 'tickets sold out' : 'flight not exist'
    }
  }
}

module.exports = {
  launch,
};