const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const validation = require('./functions/validation');
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

const redirectToLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

const redirectToHome = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/', redirectToLogin, function (req, res) {
  res.render('pages/index', {
    id: req.session.user.id,
    name: req.session.user.name,
  });
});

app.get('/register', redirectToHome, function (req, res) {
  res.render('pages/register');
});

// ユーザ登録処理
app.post(
  '/register',
  validation.validateSignUpForm(),
  (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const values = {
      name,
      email,
      password,
      confirm_password,
    };
    // バリデーションエラーの場合、エラー文と入力値を渡す
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/register', { values, errors: errors.array() });
    }
    // ユーザ登録
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    };
    users.push(newUser);
    req.session.user = newUser;
    res.redirect('/');
  }
);

app.get('/login', redirectToHome, function (req, res) {
  res.render('pages/login');
});

app.listen(3000, function () {
  console.log('Server is started.');
});
