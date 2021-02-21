const { Client, Family } = require('../models');

class clientController {
  static async getAll(req, res, next) {
    try {
      const client = await Client.findAll();

      return res.status(200).json(client);
    } catch (error) {
      next(error)
    }
  }

  static async get(req, res, next) {
    try {
      const { id } = req.params;

      const client = await Client.findByPk(id);
      if (!client) return next({ name: 'notFound' });

      return res.status(200).json(client);
    } catch (error) {
      next(error)
    }
  }

  static async store(req, res, next) {
    try {
      const { name, img, address, gender, contact, birth_date, familiesId, groupId } = req.body;
      const input = { name, img, address, gender, contact, birth_date, familiesId, groupId };

      if (familiesId) {
        const family = await Family.findByPk(familiesId)
        if (!family) return next({ name: 'notFound' });
      }

      const client = await Client.create(input);
      return res.status(201).json(client);

    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, img, address, gender, contact, birth_date, familiesId, groupId } = req.body;
      const input = { name, img, address, gender, contact, birth_date, familiesId, groupId };

      const client = await Client.findByPk(id);
      if (!client) return next({ name: 'notFound' });

      if (familiesId) {
        const family = await Family.findByPk(familiesId)
        if (!family) return next({ name: 'notFound' });
      }

      await client.update(input, { where: { id } });
      await client.reload();

      return res.status(200).json(client)

    } catch (error) {
      return next(error);
    }
  }

  static async patchDevice(req, res, next) {
    try {

    } catch (error) {
      return next(error)
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params
      const client = await Client.findByPk(id);

      if (!client) return next({ name: 'notFound' });
      await client.destroy();

      return res.status(200).json({
        message: 'successfully delete client'
      })
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = clientController