'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Device.belongsTo(models.Client, { as: 'client', foreignKey: 'clientId' });
      Device.hasMany(models.History, { as: 'history', foreignKey: 'deviceId' })
    }
  };
  Device.init({
    arduinoUniqueKey: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field arduino unique key is required'
        }
      }
    },
    longitude: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          msg: 'field longitude is required'
        },
        isFloat: {
          msg: 'field longitude must float'
        }
      }
    },
    latitude: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          msg: 'field latitude is required'
        },
        isFloat: {
          msg: 'field latitude must float'
        }
      }
    },
    panicStatus: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: {
          msg: 'field panic status is required'
        }
      }
    },
    buzzerStatus: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: {
          msg: 'field buzzer status is required'
        }
      }
    },
    clientId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};