const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  // console.log('owner', owner);
  Movie.find({ owner })
    .then((movies) => {
      // console.log('movies', movies);
      res.status(200)
        .send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200)
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некоректные данные'));
      } else {
        next(err);
      }
    });
};
const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      console.log('movie', movie)
      if (owner.toString() === movie.owner.toString()) {
        return movie.remove()
          .then(() => res.status(200)
            .send({ message: 'Фильм удалён' }));
      }
      throw new ForbiddenError('нет прав на удаление фильма');
    })
    .catch((err) => {
      console.log('err', err)
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
