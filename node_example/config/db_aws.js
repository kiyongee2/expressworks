const mysql = require("mysql");

var db = mysql.createConnection({
  host: "khitdb.cxqwcgqi8gx9.ap-northeast-2.rds.amazonaws.com",
  user: "khit",
  password: "045901kim#",
  database: "myboard2",
});

module.exports = db;