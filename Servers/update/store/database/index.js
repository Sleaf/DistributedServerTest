const mysql = require('mysql');
const accounts = require('../../../../accounts');
const databasePool = mysql.createPool({
  connectionLimit: 10,
  host: accounts.mysql.host,
  user: accounts.mysql.username,
  password: accounts.mysql.password,
  database: 'NTMTrip'
});

module.exports = databasePool;