const { User } = require('../../models')
const { Op } = require('sequelize');

const clearUser = async() => {
  if (process.env.NODE_ENV === 'test') {
    return await User.destroy({
      where: {
        id: {
          [Op.notIn]: [1, 2]
        }
      }
    })
  }
}

module.exports = clearUser;