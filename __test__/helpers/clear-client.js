const { Client } = require('../../models')

const clearClient = () => {
  if (process.env.NODE_ENV === 'test') {
    return Client.destroy({ where: {} })
  }
}

module.exports = clearClient;