const { Group } = require('../../models')
const { Op } = require('sequelize');

const clearGroup = async() => {
  if (process.env.NODE_ENV === 'test') {
    return await Group.destroy({
      where: {
        id: {
          [Op.notIn]: [1, 2]
        }
      }
    })
  }
}

module.exports = clearGroup;