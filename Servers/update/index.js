function fetchFlights() {

}

function updateDatabase() {
  // language=MySQL
  const sqlStr = `REPLACE INTO flights VALUES (?, ?, ?, ?, ?, ?)`

}

function updateCache(flight_id, flight_info) {
  //update rest of tickets
  redis.hset(`flight_${flight_id}_info`, flight_info);
}

setTimeout(() => {

}, 5 * 1000);