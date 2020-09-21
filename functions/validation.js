const { body } = require('express-validator');

exports.validateRegisterForm = () => {
  return [
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
      .withMessage('確認用パスワードは入力必須です')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('パスワードと確認用のパスワードが一致しません');
        }
        return true;
      }),
  ];
};
