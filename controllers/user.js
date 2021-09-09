const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const ServerError = require('../errors/server-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserFile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('пользователь с указанным id не найден')))
    .then((user) => {
      res.status(200).send(user)
    })
}
