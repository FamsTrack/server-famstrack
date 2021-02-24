const { Schedule } = require('../../models')
const { Op } = require('sequelize');

const clearSchedule = async() => {
  return await Schedule.destroy({ 
    where: {
      id: {
        [Op.notIn]: [1]
      }
    } 
  })
}

module.exports = clearSchedule;