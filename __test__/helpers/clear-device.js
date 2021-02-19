const { Device } = require('../../models')

const clearDevice = () => {
  if (process.env.NODE_ENV === 'test') {
    return Device.destroy({ where: {} })
  }
}

module.exports = clearDevice;