
const express = require('express');
const url = require('url');
const app = express();
const port = 3000;

app.listen(port, function(){
    console.log(`서버 실행중... use ${port}`);
})

// app.get('/', function(req, res){
//     res.send('<h2>블로그 홈입니다.</h2>')
//     //res.render('index');
// })

app.get("/", (_, res) => res.end("Home"));
app.get("/user", user);
app.get("/feed", feed);

function user(req, res){
    const user = url.parse(req.url, true).query;

    res.json(`[user] name: ${user.name}, age: ${user.age}`)
}

function feed(_, res){
    res.json(`<ul>
        <li>picture1</li>
        <li>picture2</li>
        <li>picture3</li>
        </ul>
    `)
}


