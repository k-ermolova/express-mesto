const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({}, { __v: 0 })
    .then((cards) => res.send(cards))
    .catch(() => res
      .status(500)
      .send({ message: 'На сервере произошла ошибка.' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;

  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании карточки.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(
    req.params.cardId,
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные для удаления карточки.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена.' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else {
        res
          .status(500)
          .send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
