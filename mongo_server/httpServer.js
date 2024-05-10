//http 모듈 기반 웹 서버
const http = require('http');

const hostname = '127.0.0.1';
const port = 4000;
let count = 0;

const server = http.createServer((req, res) =>{
    log(count);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    //res.write("hello");
    setTimeout(() => {
        res.end("Node.js")
    }, 2000);
    //res.end('Hello nodejs');
});

function log(count){
    console.log(count += 1);
}

server.listen(port, hostname, () => {
    console.log(`웹 서버가 실행중입니다. http://${hostname}:${port}/`);
})
