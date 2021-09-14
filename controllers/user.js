const bcrypt = require('bcryptjs');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ConflictError = require('../errors/conflict-error');
const ServerError = require('../errors/server-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserFile = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError('пользователь с указанным id не найден')))
    .then((user) => {
      res.status(200).send(user);
    });
};

const getUserProfileUpdate = (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(`Указанная почта ${email} уже зарегистрирована`));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      console.log(user);
      res.send({
        name: user.name,
        email: user.email,
        password: user.password,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректно введенные данные в поле'));
      } else if (err.code === 11000) {
        next(new ConflictError('Указанный пользователь уже зарегистрирован'));
      } else {
        next(new ServerError('Ошибка на сервере'));
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(new UnauthorizedError(`необходимо авторизоваться: ${err.message}`));
    });
};

module.exports = {
  getUserFile, getUserProfileUpdate, createUser, login,
};
