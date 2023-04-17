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
  validateDataBaseId,
} = require('../validation/validation');

router.get('/users', getUsers);

router.get('/users/:userId', validateDataBaseId, getUserById);

router.get('/users/me', getCurrentUser);

router.patch('/users/me', validateUserInfo, updateUser);

router.patch('/users/me/avatar', validateUserAvatar, updateAvatar);

module.exports = router;
