const { Group } = require('../models')

class GroupController {
  static async add(req, res, next) {
    try {
      const { name, year } = req.body
      const input = {
        name,
        year,
        UserId: req.user.id
      }

      const newGroup = await Group.create(input)
      return res.status(201).json(newGroup)
    } catch (err) {
      return next(err)
    }
  }

  static async getAll(req, res, next) {
    try {
      const group = await Group.findAll({ include: 'client' })

      return res.status(200).json(group)
    } catch (err) {
      return next(err)
    }
  }

  static async getId(req, res, next) {
    try {
      const id = req.params.id
      const group = await Group.findByPk(id, { include: 'client' })

      if (!group) return next({ name: 'notFound' })
      return res.status(200).json(group)
    } catch (err) {
      return next(err)
    }
  }

  static async update(req, res, next) {
    try {
      const id = +req.params.id
      const group = await Group.findByPk(id)
      const { name, year } = req.body
      const input = {
        name,
        year
      }

      if (!group) return next({ name: 'notFound' })
      await group.update(input, { where: { id } })
      await group.reload()

      res.status(200).json(group)
    } catch (err) {
      return next(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const id = +req.params.id
      const group = await Group.findByPk(id)

      if (!group) return next({ name: 'notFound' })
      await group.destroy()

      return res.status(200).json({ message: 'successfully delete group' })
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = GroupController