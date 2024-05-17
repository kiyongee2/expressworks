const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const session = require("express-session");
let multer = require("multer");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

// 데이터 파싱
app.use(bodyParser.urlencoded({ extended: false }));
// 정적 파일
app.use(express.static("public"));
// 세션 설정
app.use(
  session({
    secret: "hillstate116",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  // Make `user` and `authenticated` available in templates
  res.locals.sessionId = "";
  res.locals.sessionName = "";

  if (req.session.member) {
    res.locals.sessionId = req.session.member.userid;
    res.locals.sessionName = req.session.member.username;
  }
  next();
});

// db 연동
const db = require('./config/db_aws.js')
db.connect();

// 파일 업로드
let storage = multer.diskStorage({
  destination: function (req, file, done) {
    done(null, "./public/upload");
  },
  filename: function (req, file, done) {
    done(null, file.originalname);
  },
});

app.get("/", (req, res) => {
  //res.send('Hello World!')
  console.log(req.session.member);
  res.render("index");
});

app.get("/profile", (req, res) => {
  //res.send('Hello World!')
  res.render("profile");
});

app.get("/map", (req, res) => {
  //res.send('Hello World!')
  res.render("map");
});

app.get("/contact", (req, res) => {
  //res.send('Hello World!')
  res.render("contact");
});

// 문의하기
let upload = multer({ storage: storage });
app.post("/contact", upload.single("userfile"), (req, res) => {
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const title = req.body.title;
  const memo = req.body.memo;

  // 파일
  console.log(req.file);
  let filename = "";
  if (req.file !== undefined) {
    filename = `/upload/${req.file.filename}`;
  }

  //filepath = req.file.path;  // 파일경로 - public/upload/flower1.jpg
  //filepath = filepath.substring(6); // 경로변경 - upload/flower1.jpg
  let sql = `insert into contact (name, phone, email, title, memo, regdate, filename) 
    values ("${name}", "${phone}", "${email}", "${title}", "${memo}", now(), "${filename}")`;

  db.query(sql, function (err, results) {
    if (err) throw err;
    res.send(
      "<script> alert('문의 사항이 등록되었습니다.'); location.href='/contactList' </script>"
    );
  });
});

/* // 문의 게시판(검색)
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
}); */

// 문의 게시판(검색 및 페이지 처리)
app.get("/contactList", (req, res) => {

  let kw = req.query.keyword;
  console.log(kw);

  if (kw) {
    //let pageNum = parseInt(req.query.pageNum) || 1;
    let pageNum = req.query.pageNum;
    if (pageNum == null) {
      pageNum = "1";
    }

    let currentPage = parseInt(pageNum);
    let pageSize = 10;
    //페이지의 첫 번째행
    let startRow = (currentPage - 1) * pageSize + 1;
    console.log(startRow);

    //시작 페이지
    let startPage = parseInt(startRow / pageSize) + 1;
    let totalRow = 0;
    let endPage = 0;

    db.query("select count(*) as total from contact", (err, results) => {
      if (err) throw err;
      console.log(results[0]);
      totalRow = results[0].total;
      console.log("totalRow: ", totalRow);

      // 끝 페이지
      endPage = parseInt(totalRow / pageSize);
      endPage = (totalRow % pageSize === 0) ? endPage : endPage + 1;
      console.log("endPage: ", endPage);
    });

    let sql = `select * from contact where name like "%${kw}%" 
        order by idx desc limit ${startRow-1}, ${pageSize}`;
    db.query(sql, (err, results) => {
      if (err) throw err;
      const list = {
        pageNum,
        startPage,
        endPage,
        contents: results
      }
      res.render("contactList", { 
        lists: list, kw: kw
      }); //모델 전달
    });
  } else {
    //let pageNum = parseInt(req.query.pageNum) || 1;
    let pageNum = req.query.pageNum;
    if (pageNum == null) {
      pageNum = "1";
    }

    let currentPage = parseInt(pageNum);
    let pageSize = 10;
    //페이지의 첫 번째행
    let startRow = (currentPage - 1) * pageSize + 1;
    console.log(startRow);

    //시작 페이지
    let startPage = parseInt(startRow / pageSize) + 1;
    let totalRow = 0;
    let endPage = 0;

    db.query("select count(*) as total from contact", (err, results) => {
      if (err) throw err;
      console.log(results[0]);
      totalRow = results[0].total;
      console.log("totalRow: ", totalRow);

      // 끝 페이지
      endPage = parseInt(totalRow / pageSize);
      endPage = (totalRow % pageSize === 0) ? endPage : endPage + 1;
      console.log("endPage: ", endPage);
    });

    let sql = `select * from contact order by idx desc limit ${startRow-1}, ${pageSize}`;
    db.query(sql, (err, results) => {
      if (err) throw err;
      const list = {
        currentPage,
        startPage,
        endPage,
        contents: results
      }
      res.render("contactList", { 
        lists: list, kw: kw
      }); //모델 전달
    });
  }
});

// 문의 상세보기
app.get("/detail/:idx", (req, res) => {
  let idx = req.params.idx;

  let sql = "select * from contact where idx = ?"
  db.query(sql, [idx], (err, results) => {
    if(err) throw err;
    if(results.length === 0){
      res.status(400).send("요청하신 데이터를 찾을 수 없습니다.");
    }else{
      const contact = results[0];
      res.render('detail', {contact: contact});
    }
  });
})

// 문의 삭제
app.get("/deleteContact", (req, res) => {
  let idx = req.query.idx;
  let sql = `delete from contact where idx = ${idx}`;
  db.query(sql, function (err, results) {
    if (err) throw err;
    //console.log(results);
    res.send(
      "<script> alert('해당 문의가 삭제되었습니다.'); location.href='/contactList' </script>"
    );
  });
});

// 댓글 등록
app.post("/insertReply", (req, res) => {
  let idx = req.body.idx;
  console.log(req.session.member);
  let replyer = req.session.member.userid;
  let rcontent = req.body.rcontent;

  let sql = `insert into reply (idx, replyer, rcontent, rdate) 
    values (${idx}, "${replyer}", "${rcontent}", now())`;
  
  db.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect(`/detail/${idx}`);
  })
});

// 댓글 목록
app.get("/replyList", (req, res) => {

  let sql = "select * from reply where idx = ?";
  db.query(sql, (err, results) => {
    if(err) throw err;

  })
})

// 로그인 페이지
app.get("/login", (req, res) => {
  res.render("login");
});

// 로그인 처리
app.post("/login", (req, res) => {
  const userid = req.body.userid;
  const userpw = req.body.userpw;

  let sql = `select * from member where userid = "${userid}" and userpw = "${userpw}"`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    //res.send(results);
    console.log(results.length);
    if (results.length == 0) {
      res.send(
        "<script> alert('아이디나 비밀번호를 확인해주세요.'); location.href='/login' </script>"
      );
    } else {
      console.log(results[0]);
      req.session.member = results[0]; // 세션 발급
      res.send(
        "<script> alert('로그인 되었습니다.'); location.href='/' </script>"
      );
    }
  });
});

// 로그아웃
app.get("/logout", (req, res) => {
  console.log("로그아웃");
  //req.session.destroy();
  req.session.member = null;
  res.send(
    "<script> alert('로그아웃 되었습니다.'); location.href='/' </script>"
  );
});

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. http://localhost:${port}`);
});
