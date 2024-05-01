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

//body-parser 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//ejs - 템플릿 언어
app.set('view engine', 'ejs');

port = 8080

app.listen(port, function(){
    console.log("포트 8080으로 서버 대기중...");
});

app.get('/', (req, res) => {
    //res.send('<h2>Home 입니다.</h2>');
    res.sendFile(__dirname + '/index.html');
})

// 글쓰기 폼 
app.get('/enter', (req, res) => {
    //res.sendFile(__dirname + '/enter.html');
    res.render('enter.ejs');
})

// 포스트 쓰기
app.post('/save', function(req, res){
    console.log(req.body);  //입력 요청
    console.log(req.body.title);  //입력 요청
    console.log(req.body.content);  //입력 요청
    console.log(req.body.createdate);  //입력 요청
    console.log("저장 완료!!");

    //데이터베이스에 저장
    let sql = "insert into post (title, content, createdate) values (?, ?, now())";
    let params = [req.body.title, req.body.content, req.body.createdate];
    conn.query(sql, params, function(err, result){
        if(err) throw err;
        console.log('글쓰기 완료');
    });
    res.send('포스트 추가');
})

//포스트 목록
app.get('/list', function(req, res){
    //console.log("데이터 베이스 조회");
    let sql = "select * from post";
    conn.query(sql, function(err, result, fields){
        if(err) throw err;
        console.log(result);
        res.render('list.ejs', {data: result});
    })
    //res.sendFile(__dirname + '/list.html');
})