const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({ data: users}))
    .catch(err => res.status(500).send({ message: err.message }));
}