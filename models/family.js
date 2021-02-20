'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Family extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Family.belongsTo(models.User, { as: 'user', foreignKey: 'userId' })
      Family.hasMany(models.Client, { as: 'client', foreignKey: 'familiesId' })
    }
  };
  Family.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field name is required'
        }
      }
    },
    contact: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field contact is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field address is required'
        }
      }
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['pria', 'wanita'],
      allowNull: false,
      defaultValue: 'pria',
      validate: {
        isIn: {
          args: [
            ['pria', 'wanita']
          ],
          msg: "gender should be one of pria or wanita"
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'field user id is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Family',
  });
  return Family;
};