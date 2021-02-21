const { Schedule } = require('../../models')

const clearSchedule = async() => {
  if (process.env.NODE_ENV === 'test') {
    return await Schedule.destroy({where: {}})
  }
}

module.exports = clearSchedule;