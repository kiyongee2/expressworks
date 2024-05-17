// mysql connect
var mysql = require("mysql");
var db = mysql.createConnection({
    host: "localhost",
    user: "jsuser",
    password: "pwjs",
    database: "myboard"
});

db.connect();

// express framwork
const express = require('express');
const ejs = require('ejs');
const app = express();

//body-parser 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

// ejs - 템플릿 언어
app.set('view engine', 'ejs');

// 정적 파일
//app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

// 파일 업로드
const multer = require('multer');
const upload = multer({
    dest: 'uploads/'
})

// 날짜 시간 포맷
const moment = require("moment");

// 세션 생성 및 비밀번호 암호화
const session = require('express-session');
const sha = require('sha256')

app.use(session({
    secret: 'hillstate116303!@#$',
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // Make `user` and `authenticated` available in templates
    res.locals.sessionId = "";
    res.locals.sessionName = "";
    
    if(req.session.user){
        res.locals.sessionId = req.session.user.userid;
        res.locals.sessionName = req.session.user.username;
    }
    next()
})

// 포트
const port = 8080

app.listen(port, function(){
    console.log("포트 8080으로 서버 대기중...");
});

app.get('/', (req, res) => {
    //res.send('<h2>Home 입니다.</h2>');
    //res.sendFile(__dirname + '/index.html');
    console.log(req.session.user);
    res.render('index.ejs');
})

// 세션 라우터
app.get("/session", function(req, res){
    if(isNaN(req.session.milk)){
        req.session.milk = 0;
    }
    req.session.milk = req.session.milk + 100;
    res.send("session: " + req.session.milk + "원");
});

// 로그인 페이지
app.get("/login", (req, res) => {
    console.log("로그인 페이지");
    res.render("login.ejs");
});

// 로그인 처리
app.post("/login", (req, res) => {
    const {userid, userpw} = req.body;
    //console.log("아이디: " + userid);
    //console.log("비밀번호: " + userpw);

    let sql = "select * from user where userid = ? and userpw = ?";
    let params = [userid, sha(userpw)];
    db.query(sql, params, function(err, results){
        if(err) throw err;
        if(results.length == 0){
            //alert("아이디나 비밀번호를 확인해 주세요");
            console.log("아이디나 비밀번호를 확인해 주세요");
            let errorMsg = "아이디나 비밀번호를 확인해 주세요";
            res.render('login.ejs', {error: errorMsg})
        }else{
            console.log(results[0]);
            //세션 발급
            //res.send(results[0])
            req.session.user = results[0];
            res.redirect("/",);
        }
    });
    //res.send('로그인 되었습니다.');
})

// 회원가입 페이지
app.get("/signup", (req, res) => {
    res.render('signup.ejs');
})

// 회원가입 처리
app.post("/signup", (req, res) => {
    const {userid, userpw, username, useremail} = req.body;

    let sql = "insert into user (userid, userpw, username, useremail) values (?, ?, ?, ?)";
    let params = [userid, sha(userpw), username, useremail];  //비밀번호 암호화
    db.query(sql, params, function(err, results){
        if(err) throw err;
        console.log('회원가입 완료');
        res.redirect('/login')
    });
})

// 로그인 후 메인 페이지 
app.get("/main", (req, res) => {
    res.render('main.ejs');
})

// 로그아웃
app.get("/logout", (req, res) => {
    console.log('로그아웃');
    req.session.destroy();
    res.redirect('/')
})

// 글쓰기 폼 
app.get('/enter', (req, res) => {
    //res.sendFile(__dirname + '/enter.html');
    res.render('enter.ejs');
})

// 포스트 쓰기
app.post('/save', upload.single('userfile'), function(req, res){
    console.log(req.file);

    const {title, content, userfile} = req.body; 
    const {userid} = req.session.user;

    //백틱 템플릿 문제 - 글쓰기 할때 쌍따옴표 사용하면 다운됨(홑따옴표는 가능)
    // ? 사용하여 동적 바인딩 구문을 사용함
    let sql = "insert into post (title, content, createdate, userfile, userid) "
               + "values (?, ?, now(), ?, ?)";
    let params = [title, content, userfile, userid];
    db.query(sql, params, function(err, results){
        if(err) throw err;
        console.log('글쓰기 완료');
        res.redirect('/list')   
    });
    //res.send('포스트 추가');
})

// 포스트 목록
app.get('/list', function(req, res){
    //console.log("데이터 베이스 조회");
    //console.log("sessionId:", res.locals.sessionId);
    let sql = "select * from post order by id desc";
    db.query(sql, function(err, results){
        if(err) throw err;
        //console.log(results);
        res.render('list', {posts: results});
    })
    //res.sendFile(__dirname + '/list.html');
})

// 포스트 상세보기
app.get('/detail/:id', function(req, res){
    //console.log("sessionId:", res.locals.sessionId);
    let id = req.params.id;

    // 조회수 증가
    let sql = "update post set hits = hits + 1 where id = ?";
    db.query(sql, [id], (err, results) => {
        if(err) throw err;
    })

    // 글 상세보기
    sql = "select * from post where id = ?";
    db.query(sql, [id], (err, results) => {
        if(err) throw err;
        // console.log(results);
        //예외 처리
        if(results.length == 0){
            res.status(404).send("요청하신 데이터를 찾을 수 없습니다.");
        }else{
            //res.status(200).render('detail.ejs', {post: result});
            const post = results[0];
            res.status(200).render('detail', { post: post});
        }
    })
    //res.render('detail.ejs');
})

// 포스트 삭제
app.get("/delete/:id", function(req, res){
    let id = req.params.id;
    let sql = "delete from post where id = ?";
    db.query(sql, [id], (err, results) => {
        if(err) throw err;
        console.log("삭제 완료!!");
        res.redirect("/list");
    })
})

// 포스트 수정 폼
app.get("/edit/:id", (req, res) =>{
    console.log(req.params.id);
    let id = req.params.id;
    let sql = "select * from post where id = ?";
    db.query(sql, [id], (err, result, fields) => {
        if(err) throw err;
        res.render("edit.ejs", {data: result});
    })
})

// 포스트 수정 처리
app.post("/edit", function(req, res){
    console.log(req.body);
    const {id, title, content, createdate} = req.body;
    let sql = "update post set title = ?, content = ?, createdate = ? where id = ?";
    let params = [title, content, createdate, id];
    db.query(sql, params, function(err, result){
        if(err) throw err;
        console.log('글수정 완료');
        res.redirect('/list');
    });
    //res.send('포스트 수정');
})

// 쿠키 생성 및 암호화
let cookieParser = require('cookie-parser');
app.use(cookieParser('hillstate116303!@#$'));
app.get('/cookie', function(req, res){
    //res.cookie('milk', '1000원');
    //res.send('product : ' + req.cookies.milk);
    //res.cookie('milk', {maxAge : 0});  //쿠키 삭제
    let milk = parseInt(req.signedCookies.milk) + 1000;
    if(isNaN(milk)){
        milk = 0;
    }
    res.cookie('milk', milk, {signed: this});
    res.send('product: ' + milk + '원');
});

