const { Client, Family, History, Device, Schedule, Group } = require('../models');
const { Cloudinary } = require('../helpers/uploadCloudinary')
const io = require('../socketConfig');

class clientController {
  static async getAll(req, res, next) {
    try {
      const client = await Client.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [{
            model: Group,
            as: 'group',
            include: {
              model: Schedule,
              as: 'schedule'
            }
          },
          {
            model: Device,
            as: 'device'
          }, {
            model: History,
            as: 'history'
          }
        ]
      });

      return res.status(200).json(client);
    } catch (error) {
      return next(error)
    }
  }

  static async get(req, res, next) {
    try {
      const { id } = req.params;

      const client = await Client.findByPk(id);
      if (!client) return next({ name: 'notFound' });

      return res.status(200).json(client);
    } catch (error) {
      return next(error)
    }
  }

  static async store(req, res, next) {
    try {
      const { name, img, address, gender, contact, birth_date, familiesId, groupId } = req.body;
      let imgClient = img;

      if (familiesId) {
        const family = await Family.findByPk(familiesId)
        if (!family) return next({ name: 'notFound' });
      }

      if (img) {
        const uploadResponse = await Cloudinary.uploader.upload(img)
        imgClient = uploadResponse.url
      }

      const input = { name, img: imgClient, address, gender, contact, birth_date, familiesId, groupId };

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
      const { name, img, address, gender, contact, birth_date, familiesId, groupId } = req.body;
      let imgClient = img;

      const client = await Client.findByPk(id);
      if (!client) return next({ name: 'notFound' });

      if (familiesId) {
        const family = await Family.findByPk(familiesId)
        if (!family) return next({ name: 'notFound' });
      }

      if (img) {
        const uploadResponse = await Cloudinary.uploader.upload(img)
        imgClient = uploadResponse.url
      }

      const input = { name, img: imgClient, address, gender, contact, birth_date, familiesId, groupId };


      await client.update(input, { where: { id } });
      await client.reload();

      return res.status(200).json(client)

    } catch (error) {
      return next(error);
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