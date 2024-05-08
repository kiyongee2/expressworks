const express = require('express')
const ejs = require('ejs');
const bodyParser = require('body-parser')
const mysql = require("mysql");

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', './views');

// 데이터 파싱
app.use(bodyParser.urlencoded({ extended: false }));
// 정적 파일
app.use(express.static('public'));

var db = mysql.createConnection({
  host: "localhost",
  user: "jsuser",
  password: "pwjs",
  database: "myboard"
});

db.connect();

app.get('/', (req, res) => {
  //res.send('Hello World!')
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

app.post('/contact', (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const memo = req.body.memo;

  //var result = `${name} ${phone} ${email} ${memo}`;
  //res.send(result)

  let sql = `insert into contact (name, phone, email, memo, regdate) 
      values ("${name}", "${phone}", "${email}", "${memo}", now())`;
      
  db.query(sql, function(err, results){
    if(err) throw err;
    console.log('문의하기 완료!');
    //res.redirect('/');
    res.send("<script> alert('문의 사항이 등록되었습니다.'); location.href='/contactList' </script>")
  });
});

app.get('/contactList', (req, res) => {
  let sql = 'select * from contact order by idx desc';
  db.query(sql, function(err, results){
    if(err) throw err;
    //console.log(results);
    res.render('contactList', {lists: results});  //모델 전달
  })
  //res.render('contact');
})

app.get('/deleteContact', (req, res) => {
  let idx = req.query.idx;
  let sql = `delete from contact where idx = ${idx}`;
  db.query(sql, function(err, results){
    if(err) throw err;
    //console.log(results);
    res.send("<script> alert('해당 문의가 삭제되었습니다.'); location.href='/contactList' </script>");
  })
})

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. http://localhost:${port}`);
})