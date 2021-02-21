const { News } = require('../../models')
const { Op } = require('sequelize');

const clearNews = async() => {
  return await News.destroy({
    where: {
      id: {
        [Op.notIn]: [1, 2, 3]
      }
    }
  })
}

module.exports = clearNews;