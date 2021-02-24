const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY, JWT_EXPIRED } = process.env;

module.exports = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRED })
}