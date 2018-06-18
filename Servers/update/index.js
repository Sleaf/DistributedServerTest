const databasePool = require('./store/database');
const redis = require('./store/cache');
const $ = require('./util');

function getAllFlightsInfo() {
  const sqlStr = `SELECT * FROM flight_brand`;
  const sqlParams = [];
  databasePool.query(sqlStr, sqlParams, (error, results) => {
    for (const info of results) {
      fetchFlights(info)//concurrently
    }
  })
}

function fetchFlights(info) {
  console.log('航空信息：', info);
  $.ajax.post(info.url).then(res => {
    updateDatabase(info, res);//fixme 可能要自定义schema
  }, err => {
    console.error(`${new Date().format('YYYY-MM-DD')} 拉取航班信息失败：${err.msg}`)
  })
}

function updateDatabase(info, flightsData) {
  function throwAError() {
    throw new Error("Wrong data");
  }

  //write to database
  const sqlStr = `REPLACE INTO flights VALUES (?,?,?,?,?,?,?,?,?)`;
  const sqlParams = [
    flightsData.flight_id || throwAError(),
    flightsData.tripDate || throwAError(),
    flightsData.tripTime || throwAError(),
    flightsData.model || throwAError(),
    info.flight_brand_id || throwAError(),//addition
    flightsData.departure || throwAError(),
    flightsData.terminal || throwAError(),
    flightsData.price || throwAError(),
    flightsData.restTickets || throwAError(),
  ];
  databasePool.query(sqlStr, sqlParams, (error, results) => {
    if (error) console.error(`${new Date().format('YYYY-MM-DD')} 写入数据库失败：${error.message}`);
    updateCache(info, flightsData)
  })
}

function updateCache(info, flightsData) {
  //write cache
  redis.sadd(`flights_${reqDate}`, info.flight_id);
  redis.hset(`flights_${results.flight_id}_info`, flightsData);
}

setInterval(() => {
  getAllFlightsInfo()
}, 10 * 1000);