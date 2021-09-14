const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');
const {
  NODE_ENV,
  JWT_SECRET,
} = require('../utils/config');

module.exports = (req, res, next) => {
  console.log(req.headers);
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходимо авторизоваться');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret');
  } catch (err) {
    throw new UnauthorizedError('Необходимо авторизоваться');
  }
  req.user = payload;
  next();
};
