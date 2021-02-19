const bcrypt = require('bcryptjs');

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const comparePassword = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
}

module.exports = { hashPassword, comparePassword };