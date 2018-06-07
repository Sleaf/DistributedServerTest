const Redis = require('ioredis');
const accounts = require('../../../../accounts');
const redis = new Redis({
  host: accounts.redis.host,   // Redis host
  family: 4,          // 4 (IPv4) or 6 (IPv6)
  ttl: 60 * 60,  //过期时间
  db: 0
});

/*储蓄对象*/
redis.setObj = function (tag, obj) {
  if (typeof obj !== 'object') throw new Error(obj.toString() + ' is not a object!');
  return redis.set(tag, JSON.stringify(obj));
};

/*读取对象*/
redis.getObj = function (tag) {
  return new Promise((resolve, reject) => {
    redis.get(tag).then((res)=>{
      resolve(res ? JSON.parse(res) : null)
    })
  })
};


module.exports = redis;