const databasePool = require('./store/database');
const redis = require('./store/cache');
const kafka = require('./store/messageQueue');
const $ = require('./util');

//consumer
const consumerPayloads = [
  {
    topic: kafka.topic,
    offset: 0
  }
];
const consumerConfig = {
  groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group`
  // Auto commit config
  autoCommit: true,
  autoCommitIntervalMs: 5000,
  // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
  fetchMaxWaitMs: 100,
  // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
  fetchMinBytes: 1,
  // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
  fetchMaxBytes: 1024 * 1024,
  // If set true, consumer will fetch message from the given offset in the payloads
  fromOffset: false,
  // If set to 'buffer', values will be returned as raw buffer objects.
  encoding: 'utf8'
};

const consumer = new kafka.Consumer(kafka.client, consumerPayloads, consumerConfig);

consumer.on('error', function (err) {
  console.error('Error:', err.message);
});

consumer.on('offsetOutOfRange', function (err) {
  console.log('offsetOutOfRange:', err);
});

consumer.on('message', async (message) => {
  try {
    const MQPayloads = JSON.parse(message.value);
    if (!(MQPayloads.flight_id && MQPayloads.order_req)) return;
    /*获得航班信息*/
    const flight_info = await flight_info(MQPayloads.flight_id);
    /*获得银行信息*/
    const bankInfo = await bank_info(MQPayloads.bank_brand_id);
    $.ajax.post(bankInfo.verifyTokenUrl, MQPayloads.bank_token).then(
      //todo 验证token合法
    );
    //todo 验证机票合法性
    console.log('Client:', MQPayloads);
  } catch (e) {
    console.error(e.message);
  }
});

function flight_info(flight_id) {
  return new Promise((resolve, reject) => {
    const sqlStr = 'SELECT * FROM flights WHERE flight_id = ?';
    const sqlParams = [flight_id];
    databasePool.query(sqlStr, sqlParams, (error, results) => {
        return error ? reject(error.message) : resolve(results)
      }
    )
  })
}

function bank_info(bank_id) {
  return new Promise((resolve, reject) => {
    const sqlStr = 'SELECT * FROM bank_brand WHERE bank_brand_id = ?';
    const sqlParams = [bank_id];
    databasePool.query(sqlStr, sqlParams, (error, results) => {
        return error ? reject(error.message) : resolve(results)
      }
    )
  })
}