const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorNotFound(`Нет пользователя с id:${req.params.userId}`);
    })
    .then((user) => {
      res.send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный id пользователя' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: `Пользователь с id:${req.params.userId} не найден` });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => {
      throw new ErrorNotFound(`Нет пользователя с id ${req.user._id}`);
    })
    .then((user) => res.send({ name: user.name, about: user.about, _id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: `Пользователь с id:${req.user._id} не найден` });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => {
      throw new ErrorNotFound(`Нет пользователя с id ${req.user._id}`);
    })
    .then((user) => res.send({ avatar: user.avatar, _id: user._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: `Пользователь с _id:${req.user._id} не найден.` });
      }
      return res.status(500).send({ message: err.message });
    });
};
