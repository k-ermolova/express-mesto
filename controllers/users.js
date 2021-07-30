const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const InternalServerError = require('../errors/internal-server-error');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({}, { __v: 0 })
    .then((users) => res.send(users))
    .catch(() => {
      throw new InternalServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id, { __v: 0 })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан невалидный _id.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id, { __v: 0 })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан невалидный _id.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании пользователя.',
        );
      } else if (
        err.name === 'MongoError'
        && err.code === MONGO_DUPLICATE_ERROR_CODE
      ) {
        throw new ConflictError(
          'Пользователь с указанным email уже существует.',
        );
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении профиля.',
        );
      } else if (err.name === err.message) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .select('-__v')
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении аватара.',
        );
      } else if (err.name === err.message) {
        throw new NotFoundError('Пользователь по указанному _id не найден.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => {
      throw new UnauthorizedError(err.message);
    })
    .catch(next);
};
