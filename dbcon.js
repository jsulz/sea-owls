// This is our DB connection file that we keep abstracted as we'll have to rebuild it once we're done testing locally
var mysql = require('mysql');
require('dotenv').config();

var pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.HOST,
  user            : process.env.DB_CON_USER,
  password        : process.env.DB_CON_PW,
  database        : process.env.DB_CON_DB
});

module.exports.pool = pool;