const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardValidator, idValidator } = require('../middlewares/validation');

router.get('/', getCards);

router.post('/', cardValidator, createCard);

router.delete('/:cardId', idValidator, deleteCard);

router.put('/:cardId/likes', idValidator, likeCard);

router.delete('/:cardId/likes', idValidator, dislikeCard);

module.exports = router;
