// express를 사용한 서버 
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080

// mongodb 연결
const mongoclient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:1234@cluster0.wqr7ol1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
let mydb;
mongoclient.connect(url)
    .then(client => {
        //console.log('몽고 DB 접속 성공');
        mydb = client.db('myboard');

        app.listen(port, function(){
            console.log("포트 8080으로 서버 실행중...");
        })
}).catch(err => {
    console.log(err);
})

// ejs - 템플릿 언어   
app.set('view engine', 'ejs');

// body-parser
app.use(bodyParser.urlencoded({extended: true}));

// app.listen(port, function(){
//     console.log("포트 8080으로 서버 실행중...");
// })

app.get('/', function(req, res){
    //res.send('<h2>블로그 홈입니다.</h2>')
    res.render('index');
})

app.get('/enter', function(req, res){
    res.render('enter');
})

// 포스트 쓰기
app.post('/save', function(req, res){
    
    mydb.collection('post').insertOne(
        {title: req.body.title, content: req.body.content}
    ).then(result => {
        console.log(result);
        console.log('데이터 추가 성공!');
        res.redirect("/list");
    })
})

// 포스트 목록
app.get('/list', function(req, res){
    // mydb.collection('post').find().toArray().then(result => {
    //     console.log(result);
    //     //res.render('list', {posts: result});
    // })
    mydb.collection('post').find().toArray(function(err, result){
        console.log(result);
        res.render('list', {posts: result});
    })
    
})