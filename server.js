const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();

const users = [];
const SESSION_LIFETIME = 1000 * 60 * 60 * 2; // 2hours

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: SESSION_LIFETIME,
      secure: false,
    },
  })
);

app.get('/', function (req, res) {
  res.render('pages/index', { name: 'test' });
});

app.get('/register', function (req, res) {
  res.render('pages/register');
});

app.post('/register', function (req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  users.push({
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  res.redirect('/');
});

app.get('/login', function (req, res) {
  res.render('pages/login');
});

app.post('/login', function (req, res) {
  res.render('pages/login');
});

app.listen(3000, function () {
  console.log('Server is started.');
});
