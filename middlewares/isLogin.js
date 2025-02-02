const { User } = require('../models');
const decodeToken = require('../helpers/decodedToken');

module.exports = async(req, res, next) => {
  try {
    const { access_token } = req.headers;
    const decoded = decodeToken(access_token);

    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) return next({ name: 'authValidate' });

    req.user = decoded;
    return next()
  } catch (error) {
    return next(error);
  }
}