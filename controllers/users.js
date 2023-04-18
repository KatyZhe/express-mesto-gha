const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { BadRequestErr } = require('../errors/BadRequestErr');
const { ConflictErr } = require('../errors/ConflictErr');
const { NotFoundErr } = require('../errors/NotFoundErr');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw NotFoundErr(
          'Пользователь с указанным id не найден',
        );
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Пользователь с указанным id не существует'));
      }
      if (err.message === 'NotFound') {
        next(new NotFoundErr('Пользователь с указанным id не найден'));
      } else {
        next(err);
      }
    })
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw NotFoundErr(
        'Пользователь не найден',
      );
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Что-то пошло не так'));
      } else {
        next(err);
      }
    })
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password, } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }).then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    }))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Данные введены неверное, невозможно создать пользователя'));
      }
      if (err.code === 11000) {
        next(new ConflictErr('Пользователь уже зарегестрирован'));
      } else {
        next(err);
      }
    })
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send({ name: user.name, about: user.about }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Невозможно обновить данные пользователя'));
      } else {
        next(err);
      }
    })
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send({ avatar: user.avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Невозможно обновить аватар'));
      } else {
        next(err);
      }
    })
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          expires: new Date(Date.now() + 7 * 24 * 3600000),
          httpOnly: true,
          sameSite: true,
        })
        .status(200)
        .send({ message: 'Вы авторизованы' });
    })
    .catch(next);
};