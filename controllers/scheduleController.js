const { Schedule, Group } = require('../models')

class ScheduleController {
  static async add(req, res, next) {
    try {
      const id = req.params.id
      const { name, description, date, time } = req.body
      const input = { name, description, date, time, groupId: id }
      console.log(input);
      const group = await Group.findByPk(id)

      if (!group) return next({ name: 'notFound' })

      const schedule = await Schedule.create(input)
      return res.status(201).json(schedule)
    } catch (err) {
      next(err)
    }
  }

  static async getAll(req, res, next) {
    try {
      const id = req.params.id
      const group = await Group.findByPk(id)

      if (!group) return next({ name: 'notFound' })
      const scheduleData = await Schedule.findAll({ where: { groupId: id } })
      return res.status(200).json(scheduleData)
    } catch (err) {
      next(err)
    }
  }

  static async update(req, res, next) {
    try {
      const id = req.params.id
      const schId = req.params.schId
      const { name, description, date, time } = req.body
      const input = { name, description, date, time, groupId: id }
      const group = await Group.findByPk(id)
      const schedule = await Schedule.findByPk(schId)

      if (!group) return next({ name: 'notFound' })
      if (!schedule) return next({ name: 'notFound' })

      await schedule.update(input, { where: { id: schId } })
      await schedule.reload()
      return res.status(200).json(schedule)
    } catch (err) {
      next(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const id = req.params.id
      const schId = req.params.schId
      const group = await Group.findByPk(id)
      const schedule = await Schedule.findByPk(schId)

      if (!group) return next({ name: 'notFound' })
      if (!schedule) return next({ name: 'notFound' })

      await schedule.destroy()
      return res.status(200).json({ message: 'successfully delete schedule' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ScheduleController