const databasePool = require('../store/database');
const redis = require('../store/cache');
const kafka = require('../store/messageQueue');

/*发起订单*/
async function launch(ctx) {
  const payload = ctx.request.body;
  //validate request
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.date)) return ctx.throw(400);
  //find rest of seats in cache
  let res = await redis.get(`flight_${payload.id}_rest`);
  if (res && res > 0) {
    const sendMsg = JSON.stringify({
      date:payload.date,
      id:payload.id,
      username:payload.username
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
      console.log(data);
    })
  } else {
    ctx.body = {
      code: 'FAIL',
      msg: res === 0 ? 'tickets sold out' : 'flight not exist'
    }
  }
}

module.exports = {
  launch,
};