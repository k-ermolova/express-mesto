const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({}, { __v: 0 })
    .then((users) => res.send(users))
    .catch(() => res
      .status(500)
      .send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId, { __v: 0 })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Передан невалидный _id.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.postUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.updateProfile = (req, res) => {
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
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.name === 'NotFound') {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('NotFound'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (err.name === 'NotFound') {
        res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
