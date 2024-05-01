// mysql connect
var mysql = require("mysql");
var conn = mysql.createConnection({
    host: "localhost",
    user: "jsuser",
    password: "pwjs",
    database: "myboard"
});

conn.connect();
/*conn.query("select * from post", function(err, rows, fields){
    if(err) throw err;
    console.log(rows);
})*/

// express framwork
const express = require('express');

const app = express();

app.listen(8080, function(){
    console.log("포트 8080으로 서버 대기중...");
});

app.get('/', (req, res) => {
    //res.send('Home 입니다.');
    res.sendFile(__dirname + '/index.html');
})

app.get('/book', (req, res) => {
    res.send('도서 목록 페이지');
})

app.get('/list', function(req, res){
    console.log("데이터 베이스 조회");
})