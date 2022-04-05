// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400)
      .send({ message: 'Переданы некорректные данные' });
  }
  return res.status(status)
    .send({ message: err.message });
};

module.exports = errorHandler;
