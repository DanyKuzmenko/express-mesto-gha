const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/http(s)?:\/\/\S+[^\s]/),
  }),
}), createUser);

app.use(auth);

app.use(userRoutes);
app.use(cardRoutes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT);
}

app.use((req, res, next) => {
  res.status(404).send({ message: 'Введен неправильный путь' });

  next();
});

main();
