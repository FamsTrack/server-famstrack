const { User } = require('../../models')
const { Op } = require('sequelize');

const clearUser = async() => {
  return await User.destroy({
    where: {
      id: {
        [Op.notIn]: [1, 2]
      }
    }
  })
}

module.exports = clearUser;