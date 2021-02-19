const { Client } = require('../models');

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
      console.log(req.body);
      const { name, img, address, gender, contact, birth_date } = req.body;
      const input = { name, img, address, gender, contact, birth_date };
      console.log(input);

      const client = await Client.create(input);
      return res.status(201).json(client);

    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, img, address, gender, contact, birth_date } = req.body;
      const input = { name, img, address, gender, contact, birth_date };

      const client = await Client.findByPk(id);
      if (!client) return next({ name: 'notFound' });

      await client.update(input, { where: { id } });
      await client.reload();

      return res.status(200).json(client)

    } catch (error) {
      next(error);
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
      next(error);
    }
  }
}

module.exports = clientController