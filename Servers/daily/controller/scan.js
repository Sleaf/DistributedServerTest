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
    res.push(await redis.hgetall(`flight_${flight_id}_info`));
  }
  if (res.length > 0) return ctx.body = {
    code: 200,
    status: 'OK',
    data: JSON.stringify(res)
  };//found
  //find in database
  const sqlStr = 'SELECT * FROM flights NATURE JOIN flight_brand WHERE tripDate = ?';
  const sqlParams = [reqDate];
  await new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
        if (error) {
          ctx.body = {
            code: 508,
            status: 'FAIL',
            msg: error.message
          };
          return resolve();
        }
        //write cache
        redis.sadd(`flights_${reqDate}`, results.flight_id);
        redis.hset(`flights_${results.flight_id}_info`, results);
        //send back
        ctx.body = {
          code: 200,
          status: 'OK',
          data: JSON.stringify(results)
        };
        return resolve();
      }
    )
  })
}

module.exports = {
  getFlightsFsByDate,
};