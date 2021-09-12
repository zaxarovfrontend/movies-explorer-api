const router = require('express').Router();
const {celebrate, Joi} = require('celebrate');
const isURL = require("validator");
const {getMovies, createMovie, deleteMovie} = require('../controllers/movie');

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(4).max(30).required(),
    director: Joi.string().min(1).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.number().required().min(4).max(4),
    description: Joi.string().min(4).max(100).required(),
    image: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new Error('Ссылка некоректная. Добавьте корректную ссылку');
      }
      return value;
    }),
    trailer: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new Error('Поле заполнено некорректно');
      }
      return value;
    }),
    thumbnail: Joi.string().required().custom((value) => {
      if (!isURL(value)) {
        throw new Error('Поле заполнено некорректно');
      }
      return value;
    }),
    movieId: Joi.string().required(),
    nameRU: Joi.string().min(4).max(30).required(),
    nameEN: Joi.string().min(4).max(30).required(),
  }),
}), createMovie)

router.get('/movies', getMovies);

router.delete('/movies/:moviesId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;