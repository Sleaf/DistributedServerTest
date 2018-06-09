const kafka = require('kafka-node');
const accounts = require('../../../../accounts');
const client = new kafka.Client(accounts.kafka.host);

/*
* DOC
* https://github.com/SOHU-Co/kafka-node
* */

const topic = 'Posts';

module.exports = {
  Producer:kafka.Producer,
  Consumer:kafka.Consumer,
  client,
  topic
};
