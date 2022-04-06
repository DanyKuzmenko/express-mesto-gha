const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const BAD_REQUEST = 400;

  if (err.name === 'ValidationError') {
    return res.status(BAD_REQUEST)
      .send({ message: 'Переданы некорректные данные при создании пользователя' });
  }
  if (err.name === 'CastError') {
    return res.status(BAD_REQUEST)
      .send({ message: 'Передан невалидный id карточки' });
  }
  res.status(status)
    .send({ message: err.message });
  return next();
};

module.exports = errorHandler;
