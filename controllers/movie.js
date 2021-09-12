const Movie = require('../models/movie');
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");

const getMovies = (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.status(200).send(movies)
    })
    .catch(next)
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description,
    image, trailer, thumbnail, movieId, nameRU, nameEN
  } = req.body;
  Movie.create({
    country, director, duration, year, description,
    image, trailer, thumbnail, movieId, nameRU, nameEN, owner
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некоректные данные'));
      } else {
        next(err);
      }
    });
}
const deleteMovie = (req,res,next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Нет прав для удаления фильма'));
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => {
            res.status(200).send(movie);
          });
      }
    })
    .catch(next);
}

module.exports = {getMovies, createMovie, deleteMovie};


