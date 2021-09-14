const express = require('express')
const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');

const helmet = require('helmet');
const { errors } = require('celebrate');

const usersRoute = require('./routes/user')
const movieRoute = require('./routes/movie')
const { login, createUser } = require('./controllers/user');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-error');
const {
  dataMovies,
  PORT,
} = require('./utils/config');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');
const {
  createUserValidate,
  loginValidate,
} = require('./middlewares/validation');
const randomString = require('./middlewares/randomString');

mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// app.use(randomString);

app.use(helmet());
app.use('/', express.json());

app.use(limiter);
app.use(requestLogger);
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

app.post('/signup', createUserValidate, createUser);

app.post('/signin', loginValidate, login);

app.use(auth);
app.use('/', usersRoute);
app.use('/', movieRoute);

app.all('*', (req, res, next) => {
  next(new NotFoundError('ресурс не найден.'));
});

app.use(errorHandler);

app.use(errorLogger);
app.use(errors());

app.listen(PORT);
