const jwt = require('jsonwebtoken');
const TokenError = require('../errors/token-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new TokenError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new TokenError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
