const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
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
  console.log('トップ');
  res.render('pages/index', { name: req.session.user.name });
});

app.get('/register', redirectToHome, function (req, res) {
  res.render('pages/register');
});

app.post(
  '/register',
  [
    body('name').not().isEmpty().withMessage('名前は入力必須です'),
    body('email')
      .not()
      .isEmpty()
      .withMessage('メールアドレスは入力必須です')
      .isEmail()
      .withMessage('正しいメールアドレスを入力してください'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('パスワードは入力必須です')
      .isLength({ min: 7 })
      .withMessage('7文字以上のパスワードを入力してください'),
    body('confirm_password')
      .not()
      .isEmpty()
      .withMessage('パスワードは入力必須です')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('パスワードと確認用のパスワードが一致しません');
        }
        return true;
      }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('pages/register', { errors: errors.array() });
    }
    const { name, email, password } = req.body;
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
