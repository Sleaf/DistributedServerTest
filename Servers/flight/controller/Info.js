const databasePool = require('../store/database');

async function getFlightsInfo(ctx) {
  const reqDate = ctx.request.query.date;
  //find in database
  let sqlStr = 'SELECT * FROM flights';
  if (/^\d{4}-\d{2}-\d{2}$/.test(reqDate)) {
    sqlStr += ' WHERE tripDate = ?'
  }
  const sqlParams = [reqDate];
  await new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
      if (error) {
        console.error(error);
        ctx.body = {
          code  : 508,
          status: 'FAIL',
          msg   : error.message
        };
      } else {
        //send back
        ctx.body = {
          code  : 200,
          status: 'OK',
          data  : results
        };
      }
      return resolve()
    })
  })
}

async function addInfo(ctx) {
  const payload = ctx.request.body;
  const sqlStr = 'INSERT INTO flights (tripDate,tripTime,model,departure,terminal,price,restTickets) VALUES(?,?,?,?,?,?,?)';
  const sqlParams = [
    payload.tripDate || ctx.throw(400),
    payload.tripTime || ctx.throw(400),
    payload.model || ctx.throw(400),
    payload.departure || ctx.throw(400),
    payload.terminal || ctx.throw(400),
    payload.price || ctx.throw(400),
    payload.restTickets || ctx.throw(400),
  ];
  await new Promise((resolve, reject) => {
    databasePool.query(sqlStr, sqlParams, (error, results) => {
      if (error) {
        console.error(error);
        ctx.body = {
          code  : 508,
          status: 'FAIL',
          msg   : error.message
        };
      } else {
        //send back
        ctx.body = {
          code  : 200,
          status: 'OK',
          data  : null
        };
      }
      return resolve()
    })
  })
}

module.exports = {
  getFlightsInfo,
  addInfo
};