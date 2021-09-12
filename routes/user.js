const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {getUserFile, getUserProfileUpdate } =require('../controllers/user');

router.get('/users/me', getUserFile);

router.patch('/users/me',celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), getUserProfileUpdate);

module.exports = router;