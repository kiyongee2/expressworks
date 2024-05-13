const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
const port = 3000;

// 라우터 설정
app.get("/", (req, res) => {
    res.render("main", { title: "안녕하세요", message: "만나서 반갑습니다." });
});

app.listen(port, () => {
    console.log(`서버 실행중.. 포트: ${port}` );
});