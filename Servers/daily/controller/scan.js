const databasePool = require('../store/database');
const redis = require('../store/cache');

/*通过日期获取机票*/
async function getFlightsFsByDate(ctx) {
  const reqDate = ctx.request.query.date;
  //bad request
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reqDate)) return ctx.throw(400);
  //find in cache
  let allFlights = await redis.smembers(`flight_${reqDate}`);
  const res = [];
  for (const flight_id of allFlights || []) {
    res.push(await redis.hget(`flight_${flight_id}_info`));
  }
  if (res.length > 0) return ctx.body = res;//found
  //find in database
  const sqlStr = 'SELECT * FROM flights NATURE JOIN flight_brand WHERE tripDate = ?';
  const sqlParams = [reqDate];
  databasePool.query(sqlStr, sqlParams, (error, results) => {
    if (error) return console.error(error);
    //write cache
    redis.sadd(`flight_${reqDate}`, results.flight_id);
    redis.hset(`flight_${results.flight_id}_info`, results);
    //send back
    ctx.body = JSON.stringify(results);
  })
}

module.exports = {
  getFlightsFsByDate,
};