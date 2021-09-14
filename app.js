const express = require('express')

const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const router = require('./routes/index');
const { errorLogger, requestLogger } = require('./middlewares/logger');

const {
  dataMovies,
  PORT,
} = require('./utils/config');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/limiter');

// const randomString = require('./middlewares/randomString');

mongoose.connect(dataMovies, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

// app.use(randomString);

app.use(helmet());
app.use('/', express.json());
app.use(router);
app.use(limiter);
app.use(requestLogger);
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

app.use(errorHandler);

app.use(errorLogger);
app.use(errors());

app.listen(PORT);
