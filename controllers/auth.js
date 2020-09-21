const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const users = [];

exports.register = (req, res) => {
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
