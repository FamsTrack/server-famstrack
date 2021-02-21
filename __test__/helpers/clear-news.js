const { News } = require('../../models')
const { Op } = require('sequelize');

const clearNews = async() => {
  if (process.env.NODE_ENV === 'test') {
    return await News.destroy({
      where: {
        id: {
          [Op.notIn]: [1, 2, 3]
        }
      }
    })
  }
}

module.exports = clearNews;