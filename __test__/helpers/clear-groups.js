const { Group } = require('../../models')
const { Op } = require('sequelize');

const clearGroup = async() => {
  return await Group.destroy({
    where: {
      id: {
        [Op.notIn]: [1, 2]
      }
    }
  })
}

module.exports = clearGroup;