const { Family, User, Client, Group, ClientGroup } = require("../models");

class FamilyController {
  static async getAll(req, res, next) {
    try {
      const family = await Family.findAll({
        include: {
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        }
      });

      return res.status(200).json(family);
    } catch (error) {
      return next(error)
    }
  }

  static async get(req, res, next) {
    try {
      const { id } = req.params;

      const family = await Family.findByPk(id, {
        include: [{
          model: User,
          as: 'user',
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        }, {
          model: Client,
          as: 'client',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          include: {
            model: Group,
            as: 'group'
          }
        }]
      });
      if (!family) return next({ name: 'notFound' });

      return res.status(200).json(family);
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    try {
      const { name, address, gender, contact, userId } = req.body;
      const input = { name, address, gender, contact, userId };

      if (userId) {
        const user = await User.findByPk(userId)
        if (!user) return next({ name: 'notFound' });
      }

      const family = await Family.create(input);
      return res.status(201).json(family);

    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, address, gender, contact, userId } = req.body;
      const input = { name, address, gender, contact, userId };

      const family = await Family.findByPk(id);
      if (!family) return next({ name: 'notFound' });

      if (userId) {
        const user = await User.findByPk(userId)
        if (!user) return next({ name: 'notFound' });
      }

      await family.update(input, { where: { id } });
      await family.reload();

      return res.status(200).json(family)

    } catch (error) {
      return next(error);
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params
      const family = await Family.findByPk(id);

      if (!family) return next({ name: 'notFound' });
      await family.destroy();

      return res.status(200).json({
        message: 'successfully delete family'
      })
    } catch (error) {
      return next(error);
    }
  }

}

module.exports = FamilyController