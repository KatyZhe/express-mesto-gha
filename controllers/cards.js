const Card = require('../models/card');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({
          message: 'Данные введены некорректно',
        });
      }
      return res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERR_BAD_REQUEST).send({
          message: 'Данные введены некорректно',
        });
      }
      return res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERR_BAD_REQUEST).send({
          message: 'Данные введены некорректно',
        });
      }
      return res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERR_BAD_REQUEST).send({
          message: 'Данные введены некорректно',
        });
      }
      return res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};
