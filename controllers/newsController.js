const { News } = require('../models')

class NewsController {
  static async add(req, res, next) {
    try {
      const { name, image, description } = req.body
      const input = {
        name,
        image,
        description,
        active: true
      }

      const newNews = await News.create(input)
      return res.status(201).json(newNews)
    } catch (err) {
      return next(err)
    }
  }

  static async getAll(req, res, next) {
    try {
      // console.log(req.user);
      let newsData
      if (req.user.role === 'admin') {
        newsData = await News.findAll({ order: [['id']]} )
      } else {
        newsData = await News.findAll({ order: [['id']], where: { active: true } })
      }

      return res.status(200).json(newsData)
    } catch (err) {
      return next(err)
    }
  }

  static async getId(req, res, next) {
    try {
      const id = req.params.id
      const news = await News.findByPk(id)

      if (!news) return next({ name: 'notFound' })
      return res.status(200).json(news)
    } catch (err) {
      return next(err)
    }
  }

  static async update(req, res, next) {
    try {
      const id = +req.params.id
      const news = await News.findByPk(id)
      const { name, image, description, active } = req.body
      const input = {
          name,
          image,
          description,
          active
        }
        // console.log('dari controller news', news);
      if (!news) return next({ name: 'notFound' })
      await news.update(input, { where: { id } })
      await news.reload()

      res.status(200).json(news)
    } catch (err) {
      return next(err)
    }
  }

  static async patch(req, res, next) {
    try {
      const { id } = req.params
      const { active } = req.body
      const input = {
        active
      }

      const news = await News.findByPk(id)

      if (!news) return next({ name: 'notFound' })
      await news.update(input, { where: { id } })
      await news.reload()

      res.status(200).json(news)
    } catch (err) {
      console.log(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const id = +req.params.id
      const news = await News.findByPk(id)

      if (!news) return next({ name: 'notFound' })
      await news.destroy()

      return res.status(200).json({ message: 'successfully delete group' })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = NewsController