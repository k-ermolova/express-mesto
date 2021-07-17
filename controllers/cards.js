const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const InternalServerError = require('../errors/internal-server-error');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      throw new InternalServerError('На сервере произошла ошибка.');
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;

  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (card && String(card.owner) !== req.user._id) {
        next(new ForbiddenError('Невозможно удалить чужую карточку.'));
      }
      return card;
    })
    .then((card) => {
      if (card) {
        res.send(card);
        return Card.findByIdAndRemove(
          req.params.id,
          { new: true },
        );
      }
      next(new NotFoundError('Карточка с указанным _id не найдена.'));
      return card;
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для удаления карточки.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для снятия лайка.');
      } else {
        throw new InternalServerError('На сервере произошла ошибка.');
      }
    })
    .catch(next);
};
