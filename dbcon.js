// This is our DB connection file that we keep abstracted as we'll have to rebuild it once we're done testing locally
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_sulzdorj',
  password        : '2201',
  database        : 'cs340_sulzdorj'
});

module.exports.pool = pool;