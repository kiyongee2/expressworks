
const express = require('express');
const app = express();
const port = 3000;

let posts = []

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json(posts);
})

app.get('/posts', (req, res) => {
    const { title, name, text } = req.body;

    // 게시글 추가
    posts.push({id: posts.length + 1, title, name, text, createDate: Date()});
    res.json({ title, name, text })
})

app.listen(port, function(){
    console.log(`서버 실행중... use ${port}`);
})




