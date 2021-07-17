const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

module.exports.registrationValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(
      (value, helpers) => {
        if (validator.isURL(value, {
          require_protocol: true,
        })) {
          return value;
        }
        return helpers.message('Некорректный формат ссылки.');
      },
    ),
  }),
});

module.exports.loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.userInfoValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

module.exports.avatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(
      (value, helpers) => {
        if (validator.isURL(value, {
          require_protocol: true,
        })) {
          return value;
        }
        return helpers.message('Некорректный формат ссылки.');
      },
    ),
  }),
});

module.exports.idValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string(),
  }),
});

module.exports.cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom(
      (value, helpers) => {
        if (validator.isURL(value, {
          require_protocol: true,
        })) {
          return value;
        }
        return helpers.message('Некорректный формат ссылки.');
      },
    ),
  }),
});
