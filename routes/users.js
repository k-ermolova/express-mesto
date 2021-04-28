const router = require('express').Router();
const { getUsers, getUserById, postUser, updateProfile, updateAvatar } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUserById);

router.post('/users', postUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateAvatar);

module.exports = router;