const express = require('express');
const session = require('express-session');
const validation = require('./functions/validation');
const auth = require('./controllers/auth');
const app = express();

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
  validation.validateRegisterForm(),
  (req, res) => auth.register(req, res)
);

app.get('/login', redirectToHome, function (req, res) {
  res.render('pages/login');
});

app.listen(3000, function () {
  console.log('Server is started.');
});
