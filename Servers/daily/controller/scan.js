const databasePool = require('../store/database');
const redis = require('../store/cache');

/*通过日期获取机票*/
async function getTicketsByDate(ctx) {
  const reqDate = ctx.request.query.date;
  //bad request
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reqDate)) return ctx.throw(400);
  //find in cache
  let res = await redis.get(`flight_${reqDate}`);
  if (res) return ctx.body = res;//found
  //find in database
  const sqlStr = 'SELECT * FROM flights NATURE JOIN flight_brand WHERE tripDate = ?';
  const sqlParams = [reqDate];
  databasePool.query(sqlStr, sqlParams, (error, results) => {
    if (error) return console.error(error);
    //write cache
    const resStr = JSON.stringify(results);
    console.log(resStr);
    redis.set(`flight_${reqDate}`, resStr);
    //send back
    ctx.body = resStr;
  })

}

module.exports = {
  getTicketsByDate,

};