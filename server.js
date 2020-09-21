const express = require('express');
const session = require('express-session');
const validation = require('./functions/validation');
const auth = require('./controllers/auth');
const app = express();

const users = [{
  id: '1120463234934',
  name: 'test1',
  email: 'test1@gmail.com',
  password: 'password'
}];
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
  if (!req.session.userId) {
    res.redirect('/login');
  } else {
    next();
  }
};

const redirectToHome = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/');
  } else {
    next();
  }
};

app.get('/', redirectToLogin, function (req, res) {
  const user = users.find(user => user.id === req.session.userId);
  res.render('pages/index', {
    id: req.session.userId,
    name: user.name,
  });
});

app.get('/register', redirectToHome, function (req, res) {
  res.render('pages/register');
});

// ユーザ登録処理
app.post(
  '/register',
  validation.validateRegisterForm(),
  async (req, res) => {
    const newUser = await auth.register(req, res);
    users.push(newUser);
    req.session.userId = newUser.id;
    res.redirect('/');
  }
);

app.get('/login', redirectToHome, function (req, res) {
  res.render('pages/login');
});

app.listen(3000, function () {
  console.log('Server is started.');
});
