// This is our DB connection file that we keep abstracted as we'll have to rebuild it once we're done testing locally
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'seaowl',
  password        : 'trojans45',
  database        : 'test'
});

module.exports.pool = pool;