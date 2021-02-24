const { Client } = require('../../models')

const clearClient = () => {
  return Client.destroy({ where: {} })
}

module.exports = clearClient;