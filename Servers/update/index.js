const databasePool = require('./store/database');
const redis = require('./store/cache');
const $ = require('./util');

function getAllFlightsInfo() {
  const sqlStr = `SELECT * FROM flight_brand`;
  const sqlParams = [];
  databasePool.query(sqlStr, sqlParams, (error, results) => {
    if (error) {
      return console.error(`${new Date().format('YYYY-MM-DD')} 读取数据库失败：${error.message}`);
    }
    for (const info of results) {
      fetchFlights(info)//concurrently
    }
  })
}

function fetchFlights(info) {
  // console.log(`查询航空信息：${info.flight_brand_id}-${info.flight_brand_name}`);
  $.ajax.get(info.flight_brand_url).then(res => {
    // console.log(res);
    for (const flight of res) {
      updateDatabase(info, flight);
    }//fixme 可能要自定义schema
  }, err => {
    console.error(`${new Date().format('YYYY-MM-DD')} 拉取航班信息失败：${err.msg}`)
  })
}

function updateDatabase(info, flightsData) {
  function throwAError(e) {
    console.error(e);
    throw new Error("Wrong data");
  }

  //write to database
  const sqlStr = `REPLACE INTO flights VALUES (?,?,?,?,?,?,?,?,?)`;
  const sqlParams = [
    flightsData.flight_id || throwAError(1),
    new Date(flightsData.tripDate).format('YYYY-MM-DD') || throwAError(2),
    flightsData.tripTime || throwAError(3),
    flightsData.model || throwAError(4),
    info.flight_brand_id || throwAError(5),//addition
    flightsData.departure || throwAError(6),
    flightsData.terminal || throwAError(7),
    flightsData.price || throwAError(8),
    flightsData.restTickets || throwAError(9),
  ];
  databasePool.query(sqlStr, sqlParams, (error, results) => {
    if (error) return console.error(`${new Date().format('YYYY-MM-DD')} 写入数据库失败：${error.message}`);
    updateCache(info, flightsData)
  })
}

function updateCache(info, flightsData) {
  //write cache
  redis.sadd(`flights_${new Date(info.tripDate).format('YYYY-MM-DD')}`, info.flight_id);
  for (const [label, value] of Object.entries(flightsData)) {
    redis.hset(`flights_${info.flight_id}_info`, label, value);
  }
}

setInterval(() => {
  getAllFlightsInfo()
}, 10 * 1000);
console.log('更新服务器已启动，定时抓取航班信息...');
