const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY)
}