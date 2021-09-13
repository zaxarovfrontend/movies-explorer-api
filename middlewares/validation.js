// const {celebrate, Joi} = require('celebrate');
//
//
// const createUserValidate = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(4),
//     name: Joi.string().min(2).max(30),
//   }),
// })
//
// const userValidate = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     email: Joi.string().required().email(),
//   }),
// })
//
//   module.exports = {userValidate,
//   createUserValidate}
