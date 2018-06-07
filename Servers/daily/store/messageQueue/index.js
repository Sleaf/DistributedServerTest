const kafka = require('kafka-node');
const accounts = require('../../../../accounts');
const client = new kafka.Client(accounts.kafka.host);

/*
* DOC
* https://github.com/SOHU-Co/kafka-node
* */
const topic = 'Orders';
//producer
const producer = new kafka.Producer(client);
producer.on('ready', function () {
  // console.log('Producer is ready');
  const topics = [topic];
  producer.createTopics(topics, true, function (err, data) {
    console.log(`topic [${topics}] created`);
  });
});
producer.on('error', function (err) {
  console.log('Producer is in error state');
  console.log(err);
});

//consumer
const consumerPayloads = [
  {
    topic: topic,
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

const consumer = new kafka.Consumer(client, consumerPayloads, consumerConfig);
consumer.on('message', function (message) {
  console.log('Client:', message);
});
consumer.on('error', function (err) {
  console.error('Error:', err.message);
});
consumer.on('offsetOutOfRange', function (err) {
  console.log('offsetOutOfRange:', err);
});


module.exports = {
  client,
  topic,
  producer,
  consumer
};
