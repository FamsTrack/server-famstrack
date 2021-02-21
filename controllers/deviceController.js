const { Client, Device } = require('../models');

class DeviceController {
  static async getAll(req, res, next) {
    try {
      const device = await Device.findAll();
      return res.status(200).json(device);
    } catch (error) {
      next(error)
    }
  }

  static async get(req, res, next) {
    try {
      const { id } = req.params;

      const device = await Device.findByPk(id);
      if (!device) return next({ name: 'notFound' });

      return res.status(200).json(device);
    } catch (error) {
      next(error)
    }
  }

  static async store(req, res, next) {
    try {
      const { arduinoUniqueKey, longitude, latitude, panicStatus, buzzerStatus, clientId } = req.body;
      const input = { arduinoUniqueKey, longitude, latitude, panicStatus, buzzerStatus, clientId: (!clientId) ? null : clientId }

      if (clientId) {
        const client = await Client.findByPk(clientId)
        if (!client) return next({ name: 'notFound' });
      }

      const device = await Device.create(input);
      return res.status(201).json(device);
    } catch (error) {
      next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { arduinoUniqueKey, longitude, latitude, panicStatus, buzzerStatus, clientId } = req.body;
      const input = { arduinoUniqueKey, longitude, latitude, panicStatus, buzzerStatus, clientId: (!clientId) ? null : clientId };

      const device = await Device.findByPk(id);
      if (!device) return next({ name: 'notFound' });

      if (clientId) {
        const client = await Client.findByPk(clientId)
        if (!client) return next({ name: 'notFound' });
      }

      await device.update(input, { where: { id } });
      await device.reload();

      return res.status(200).json(device)
    } catch (error) {
      next(error)
    }
  }

  static async destroy(req, res, next) {
    try {
      const { id } = req.params
      const device = await Device.findByPk(id);

      if (!device) return next({ name: 'notFound' });
      await device.destroy();

      return res.status(200).json({
        message: 'successfully delete device'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = DeviceController;