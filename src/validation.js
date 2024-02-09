const { Joi } = require("express-validation");
const validateRegisterUser = {
  body: Joi.object({
    email: Joi.string().email().trim().required(),
    name: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  }),
};

const validateLoginUser = {
  body: Joi.object({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().required(),
  }),
};

const validateCreateBook = {
  body: Joi.object({
    title: Joi.string().trim().required(),
    author: Joi.string().trim().required(),
    ISBN: Joi.string().trim().required(),
    quantityAvailable: Joi.number().min(1).required(),
  }),
};

module.exports = {
  validateRegisterUser,
  validateLoginUser,
  validateCreateBook,
};
