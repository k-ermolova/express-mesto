const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { cardValidator, idValidator } = require('../middlewares/validation');

router.get('/', getCards);

router.post('/', cardValidator, createCard);

router.delete('/:id', idValidator, deleteCard);

router.put('/:id/likes', idValidator, likeCard);

router.delete('/:id/likes', idValidator, dislikeCard);

module.exports = router;
