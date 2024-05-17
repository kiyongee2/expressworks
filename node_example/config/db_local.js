const mysql = require("mysql");

var db = mysql.createConnection({
  host: "localhost",
  user: "jsuser",
  password: "pwjs",
  database: "myboard",
});

module.exports = db;