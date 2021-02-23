const { User } = require('../models')
const { comparePassword } = require('../helpers/hash')
const generateToken = require('../helpers/generateToken');

class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password, pushToken } = req.body;
      const input = {
        pushToken
      }

      const user = await User.findOne({ where: { email } });
      if (!user) next({ name: 'authValidate' });

      const checkPassword = comparePassword(password, user.password);
      if (!checkPassword) return next({ name: 'authValidate' });

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      }
      const access_token = generateToken(payload);

      // SET PUSHTOKEN
      await user.update(input, { where: { email } })
      await user.reload()

      return res.status(200).json({ access_token });
    } catch (error) {
      return next(error);
    }
  }

  static async loginWeb(req, res, next) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ where: { email } });
      if (!user) next({ name: 'authValidate' });
      if (user.role !== 'admin') next({ name: 'onlyAdmin' })

      const checkPassword = comparePassword(password, user.password);
      if (!checkPassword) return next({ name: 'authValidate' });

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      }
      const access_token = generateToken(payload);
      return res.status(200).json({ access_token });
    } catch (err) {
      next(err)
    }
  }

  static async register(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const input = { email, password, role };

      const create = await User.create(input);

      return res.status(201).json({
        id: create.id,
        email: create.email,
        role: create.role
      })
    } catch (error) {
      return next(error)
    }
  }

  static async getAll(req, res, next) {
    try {
      let usersData

      if (req.user.role === 'admin') {
        usersData = await User.findAll({order: [['id']]})
      } else {
        return next({name: 'unauthorize'})
      }

      res.status(200).json(usersData)
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params
      let user
      console.log(id);

      if (req.user.role === 'admin') {
        user = await User.findByPk(id)
        if (!user) return next({name: 'notFound'})
      } else {
        return next({name: 'unauthorize'})
      }

      await user.destroy()
      res.status(200).json({message: 'successfully delete user'})
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;