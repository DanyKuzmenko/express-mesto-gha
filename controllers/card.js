const Card = require('../models/card');
const ErrorNotFound = require('../errors/ErrorNotFound');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({
      name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      throw new ErrorNotFound(`Карточки с id:${req.params.cardId} не существует`);
    })
    .then((card) => res.send({
      name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id,
    }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.statusCode === 404) {
        return res.status(404).send({ message: `Карточка с _id:${req.params.cardId} не найдена` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Карточки с id:${req.params.cardId} не существует`);
    })
    .then((card) => res.send({
      name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: `Карточка с _id:${req.params.cardId} не найдена` });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorNotFound(`Карточки с id:${req.params.cardId} не существует`);
    })
    .then((card) => res.send({
      name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id,
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: `Карточка с _id:${req.params.cardId} не найдена` });
      }
      return res.status(500).send({ message: err.message });
    });
};
