const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('pages/index');
});

app.get('/login', function (req, res) {
  res.render('pages/login');
});

app.listen(3000);
