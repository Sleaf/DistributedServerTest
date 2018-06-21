const databasePool = require('../store/database');
const redis = require('../store/cache');

/*通过日期获取机票*/
async function getFlightsFsByDate(ctx) {
  const reqDate = ctx.request.query.date;
  //bad request
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reqDate)) return ctx.throw(400);
  //find in cache
  let allFlights = await redis.smembers(`flights_${reqDate}`);
  const res = [];
  for (const flight_id of allFlights || []) {
    const cache = await redis.hgetall(`flights_${flight_id}_info`);
    if (cache.flight_id > 0) {
      res.push(cache);
      console.log('读取缓存：', cache);
    }
  }
  if (res.length > 0) {
    //found
    return ctx.body = {
      code  : 200,
      status: 'OK',
      data  : res
    };
  }
  //find in database
  const sqlStr = 'SELECT * FROM flights NATURE JOIN flight_brand WHERE tripDate = ?';
  const sqlParams = [reqDate];
  await new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
        if (error) {
          ctx.body = {
            code  : 508,
            status: 'FAIL',
            msg   : error.message
          };
          return resolve();
        }
        for (const flight of results) {
          //write cache
          redis.sadd(`flights_${reqDate}`, flight.flight_id);
          for (const [label, value] of Object.entries(flight)) {
            redis.hset(`flights_${flight.flight_id}_info`, label, value);
          }
          console.log('写入缓存：', `flights_${flight.flight_id}_info`, flight);
          // redis.expire(`flights_${flight.flight_id}_info`, 60);
        }

        //send back
        ctx.body = {
          code  : 200,
          status: 'OK',
          data  : results
        };
        return resolve();
      }
    )
  })
}

module.exports = {
  getFlightsFsByDate,
};