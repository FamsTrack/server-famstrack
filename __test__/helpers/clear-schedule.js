const { Schedule } = require('../../models')

const clearSchedule = async() => {
  return await Schedule.destroy({ where: {} })
}

module.exports = clearSchedule;