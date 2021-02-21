const { Device } = require('../../models')

const clearDevice = () => {
  return Device.destroy({ where: {} })
}

module.exports = clearDevice;