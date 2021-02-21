const { Family } = require('../../models')

const clearFamily = () => {
  if (process.env.NODE_ENV === 'test') {
    return Family.destroy({ where: {} })
  }
}

module.exports = clearFamily;