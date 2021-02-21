const { Group } = require('../../models')

const clearGroup = () => {
  if (process.env.NODE_ENV === 'test') {
    return Group.destroy({ where: {} })
  }
}

module.exports = clearGroup;