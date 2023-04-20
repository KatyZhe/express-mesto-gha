const router = require('express').Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateAvatar,
  updateUser,
} = require('../controllers/users');

const {
  validateUserInfo,
  validateUserAvatar,
  userIdValidation,
} = require('../validation/validation');

router.get('/users', getUsers);

router.get('/users/me', getCurrentUser);

router.get('/users/:userId', userIdValidation, getUserById);

router.patch('/users/me', validateUserInfo, updateUser);

router.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
