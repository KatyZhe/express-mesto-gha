const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateDataBaseId,
  validateCardInfo,
} = require('../validation/validation');

router.get('/cards', getCards);

router.post('/cards', validateCardInfo, createCard);

router.delete('/cards/:id', validateDataBaseId, deleteCard);

router.put('/cards/:id/likes', validateDataBaseId, likeCard);

router.delete('/cards/:id/likes', validateDataBaseId, dislikeCard);

module.exports = router;
