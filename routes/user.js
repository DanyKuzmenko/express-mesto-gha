const express = require('express');
const {
  celebrate,
  Joi, Segments,
} = require('celebrate');

const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/user');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', celebrate({
  [Segments.PARAMS]: {
    userId: Joi.string().required().min(24).max(24),
  },
}), getUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    about: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(/http(s)?:\/\/\S+[^\s]/),
  }),
}), updateAvatar);

module.exports = router;
