'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/hash');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Family, { as: 'family', foreignKey: 'userId' })
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field email is required'
        },
        isEmail: {
          msg: 'invalid email'
        }
      },
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field password is required'
        },
        len: {
          args: 6,
          msg: 'password at least have 6 character'
        }
      }
    },
    role: {
      type: DataTypes.ENUM,
      values: ['admin', 'family'],
      allowNull: false,
      defaultValue: 'family',
      validate: {
        isIn: {
          args: [
            ['admin', 'family']
          ],
          msg: "role should be one of admin or family"
        }
      }
    },
    pushToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(instance) {
        instance.password = hashPassword(instance.password)
      }
    }
  });
  return User;
};