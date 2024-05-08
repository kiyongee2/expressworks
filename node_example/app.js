const express = require('express')
const ejs = require('ejs');
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  //res.send('Hello World!')
  res.render('index');
});

app.get('/profile', (req, res) => {
  //res.send('Hello World!')
  res.render('profile');
});

app.listen(port, () => {
  console.log(`서버가 실행되었습니다. http://localhost:${port}`)
})