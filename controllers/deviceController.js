const { Client, Device, History, Family, User } = require('../models');
const io = require('../socketConfig');
const axios = require('axios');
const { response } = require('express');

class DeviceController {
  static async getAll(req, res, next) {
    try {
      const device = await Device.findAll();

      return res.status(200).json(device);
    } catch (error) {
      return next(error)
    }
  }

  static async get(req, res, next) {
    try {
      const { id } = req.params;

      const device = await Device.findByPk(id);
      if (!device) return next({ name: 'notFound' });

      return res.status(200).json(device);
    } catch (error) {
      return next(error)
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

      const deviceUnique = await Device.findOne({ where: { arduinoUniqueKey } });
      if (deviceUnique) return next({ name: 'deviceUnique' })

      const device = await Device.create(input);
      return res.status(201).json(device);
    } catch (error) {
      return next(error)
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { arduinoUniqueKey, longitude, latitude, panicStatus, buzzerStatus, clientId } = req.body;
      const input = { arduinoUniqueKey, longitude, latitude, panicStatus, buzzerStatus, clientId: (!clientId) ? null : clientId };

      const device = await Device.findByPk(id);
      if (!device) return next({ name: 'notFound' });

      const deviceUnique = await Device.findOne({ where: { arduinoUniqueKey } });
      if (deviceUnique && deviceUnique.id !== +id) return next({ name: 'deviceUnique' })

      if (clientId) {
        const client = await Client.findByPk(clientId)
        if (!client) return next({ name: 'notFound' });
      }

      await device.update(input, { where: { id } });
      await device.reload();

      return res.status(200).json(device)
    } catch (error) {
      return next(error)
    }
  }

  static async patchDevice(req, res, next) {
    try {
      const { arduinoUniqueKey } = req.params;
      const data = req.query;

      const device = await Device.findOne({ where: { arduinoUniqueKey } });

      if (!device) return next({ name: 'notFound' });

      await device.update(data, { where: { arduinoUniqueKey } });
      await device.reload();

      await History.create({ longitude: device.longitude, latitude: device.latitude, clientId: device.clientId, deviceId: device.id })

      if (device.panicStatus) {
        const searchToken = await Client.findOne({
          where: { id: device.clientId },
          include: {
            model: Family,
            as: 'family',
            include: {
              model: User,
              as: 'user'
            }
          }
        })
        const admin = await User.findOne({
          where: {role: 'admin'}
        })

        // SEND PUSH NOTIF TO ADMIN 
        axios({
          method: 'POST',
          url: 'https://exp.host/--/api/v2/push/send',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            to: admin.pushToken,
            title: 'Someone pressed the panic button',
            body: `${searchToken.name}, id ${searchToken.id} pressed the panic button. Investigate his/her situation as soon as posible!`
          }
        })
        .then(response => console.log(response.data))
        .catch(err => console.log(err))

        // SEND PUSH NOTIF TO FAMILY
        axios({
            method: 'POST',
            url: 'https://exp.host/--/api/v2/push/send',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              to: searchToken.family.user.pushToken,
              title: `${searchToken.name} pressed the panic button`,
              body: 'please dont be panic, we will investigate the situation'
            }
          })
          .then(response => console.log(response.data))
          .catch(err => console.log(err))
      }

      // SET BUZZERSTATUS BACK TO FALSE
      if (device.buzzerStatus) {
        setTimeout(async() => {
          await device.update({ buzzerStatus: false }, { where: { arduinoUniqueKey } });
          await device.reload();
        }, 5000)
      }

      // TODO exemple using socket to broadcast to all user 
      io.emit('data:device', device)

      return res.status(200).send(device.buzzerStatus ? '1' : '0')
    } catch (error) {
      return next(error)
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
      return next(error)
    }
  }
}

module.exports = DeviceController;