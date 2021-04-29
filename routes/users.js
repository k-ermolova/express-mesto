const router = require('express').Router();
const { getUsers, getUserById, postUser, updateProfile, updateAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.post('/', postUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;