const Card = require('../models/card');
const { Errors } = require('../errors/Errors.js');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      throw Errors.iternal();
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
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
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw Errors.badRequest(
          'Невозможно создать карточку, проверьте введенные данные',
        );
      }
      throw Errors.iternal();
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw Errors.notFound('Карточка не существует');
    })
    .then(({ owner }) => {
      if (owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.id).then((card) => {
          res.status(200).send(card);
        });
      } else {
        throw Errors.forbidden();
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw Errors.badRequest(
          'Невозможно удалить карточку',
        );
      }
      throw err;
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw Errors.notFound('Карточка не найдена');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw Errors.badRequest(
          'Неверные данные',
        );
      }
      throw err;
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw Errors.notFound('Карточка не существует');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw Errors.badRequest(
          'Неверные данные',
        );
      }
      throw err;
    })
    .catch(next);
};
