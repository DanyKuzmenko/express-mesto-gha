const express = require('express');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateAvatar);

module.exports = router;