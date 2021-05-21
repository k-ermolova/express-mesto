const router = require('express').Router();
const {
  getUsers, getUserById, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { userInfoValidator, avatarValidator, idValidator } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);

router.get('/:id', idValidator, getUserById);

router.patch('/me', userInfoValidator, updateProfile);

router.patch('/me/avatar', avatarValidator, updateAvatar);

module.exports = router;
