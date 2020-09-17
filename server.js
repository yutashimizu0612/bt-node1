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

// validation
// Sessionでログイン状態を作る

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
  console.log('トップ');
  res.render('pages/index', { name: req.session.user.name });
});

app.get('/register', redirectToHome, function (req, res) {
  res.render('pages/register');
});

app.post('/register', function (req, res) {
  const { name, email, password, confirm_password } = req.body;
  if (name && email && password && confirm_password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
    };
    users.push(newUser);
    req.session.user = newUser;
    console.log(req.session.user);
  }
  res.redirect('/');
});

app.get('/login', redirectToHome, function (req, res) {
  res.render('pages/login');
});

app.listen(3000, function () {
  console.log('Server is started.');
});
