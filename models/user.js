const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail, isURL } = require('validator');
const { UnauthorizedErr } = require('../errors/UnauthorizedErr')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: isURL,
    message: 'Вставьте корректную ссылку',
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator: isEmail,
    message: 'Введите верный email',
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new UnauthorizedErr());
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        return Promise.reject(new UnauthorizedErr());
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
