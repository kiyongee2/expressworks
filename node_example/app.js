const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser')
const mysql = require("mysql");
const session = require('express-session')
let multer = require('multer')

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', './views');

// 데이터 파싱
app.use(bodyParser.urlencoded({ extended: false }));
// 정적 파일
app.use(express.static('public'));
// 세션 설정
app.use(session({
  secret: 'hillstate116',
  resave: false,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  // Make `user` and `authenticated` available in templates
  res.locals.sessionId = "";
  res.locals.sessionName = "";
  
  if(req.session.member){
      res.locals.sessionId = req.session.member.userid;
      res.locals.sessionName = req.session.member.username;
  }
  next()
})

// db 객체 생성
var db = mysql.createConnection({
  host: "khitdb.cxqwcgqi8gx9.ap-northeast-2.rds.amazonaws.com",
  user: "khit",
  password: "045901kim#",
  database: "myboard2"
});
// db 접속
db.connect();

// 파일 업로드
let storage = multer.diskStorage({
  destination: function(req, file, done){
    done(null, "./public/upload")
  },
  filename: function(req, file, done){
    done(null, file.originalname)
  }
})

app.get('/', (req, res) => {
  //res.send('Hello World!')
  console.log(req.session.member);
  res.render('index');
});

app.get('/profile', (req, res) => {
  //res.send('Hello World!')
  res.render('profile');
});

app.get('/map', (req, res) => {
  //res.send('Hello World!')
  res.render('map');
});

app.get('/contact', (req, res) => {
  //res.send('Hello World!')
  res.render('contact');
});

// 문의하기
let upload = multer({storage: storage});
app.post('/contact', upload.single('userfile'), (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const memo = req.body.memo;

  // 파일
  //console.log(req.file);
  const filename = `/upload/${req.file.filename}`;
  
  //filepath = req.file.path;  // 파일경로 - public/upload/flower1.jpg
  //filepath = filepath.substring(6); // 경로변경 - upload/flower1.jpg
  if(filename){
    let sql = `insert into contact (name, phone, email, memo, regdate, filename) 
      values ("${name}", "${phone}", "${email}", "${memo}", now(), "${filename}")`;
    
    db.query(sql, function(err, results){
      if(err) throw err;
      res.send("<script> alert('문의 사항이 등록되었습니다.'); location.href='/contactList' </script>")
    });
  }else{
    let sql = `insert into contact (name, phone, email, memo, regdate) 
      values ("${name}", "${phone}", "${email}", "${memo}", now())`;
    
    db.query(sql, function(err, results){
      if(err) throw err;
      res.send("<script> alert('문의 사항이 등록되었습니다.'); location.href='/contactList' </script>")
    });
  }
});

// 문의 게시판(검색)
app.get('/contactList', (req, res) => {
  let kw = req.query.keyword;
  console.log(kw);
  
  if(kw){
    sql = `select * from contact where name like "%${kw}%" order by idx desc`;
    db.query(sql, function(err, results){
      if(err) throw err;
      res.render('contactList', {lists: results});  //모델 전달
    })
  }else{
    sql = `select * from contact order by idx desc`;
    db.query(sql, function(err, results){
      if(err) throw err;
      res.render('contactList', {lists: results});  //모델 전달
    })
  }
});

// 문의(검색)
/*
app.get('/search', function(req, res){
  console.log(req.query);
})*/

// 문의 삭제
app.get('/deleteContact', (req, res) => {
  let idx = req.query.idx;
  let sql = `delete from contact where idx = ${idx}`;
  db.query(sql, function(err, results){
    if(err) throw err;
    //console.log(results);
    res.send("<script> alert('해당 문의가 삭제되었습니다.'); location.href='/contactList' </script>");
  })
})

// 로그인 페이지
app.get('/login', (req, res) => {
  res.render('login');
});

// 로그인 처리
app.post('/login', (req, res) => {
  const userid = req.body.userid;
  const userpw = req.body.userpw;

  let sql = `select * from member where userid = "${userid}" and userpw = "${userpw}"`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    //res.send(results);
    console.log(results.length);
    if(results.length == 0){
      res.send("<script> alert('아이디나 비밀번호를 확인해주세요.'); location.href='/login' </script>")
    } else{
      console.log(results[0]);
      req.session.member = results[0];  // 세션 발급
      res.send("<script> alert('로그인 되었습니다.'); location.href='/' </script>")
    }
  })
});

// 로그아웃
app.get("/logout", (req, res) => {
  console.log('로그아웃');
  //req.session.destroy();
  req.session.member = null;
  res.send("<script> alert('로그아웃 되었습니다.'); location.href='/' </script>")
})

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. http://localhost:${port}`);
})