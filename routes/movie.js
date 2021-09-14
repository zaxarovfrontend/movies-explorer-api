const router = require('express').Router();
// eslint-disable-next-line import/no-extraneous-dependencies

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');
const {
  MovieValidation,
  MovieIdValidation,
} = require('../middlewares/validation');

router.post('/movies', MovieValidation, createMovie);

router.get('/movies', getMovies);

router.delete('/movies/:movieId',MovieIdValidation, deleteMovie);

module.exports = router;
