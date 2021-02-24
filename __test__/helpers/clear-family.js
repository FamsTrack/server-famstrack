const { Family } = require('../../models')

const clearFamily = () => {
  return Family.destroy({ where: {} })
}

module.exports = clearFamily;