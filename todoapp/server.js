
const express = require('express');
const app = express();
const port = 8080;

app.get("/", (req, res) => {
    //res.send("홈 페이지 방문을 환영합니다.");
    res.sendFile(__dirname + "/index.html");
})

app.listen(port, () => {
    console.log(`서버 실행중.. 포트: ${port}`);
});
