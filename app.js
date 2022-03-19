const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cardRoutes = require('./routes/card');
const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
})

app.use((req, res, next) => {
  req.user = {
    _id: '6234324960ec4672395fb765'
  };

  next();
}); 

app.use(express.json());
app.use(userRoutes);
app.use(cardRoutes);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT);
}

main();



