'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Client.belongsTo(models.Family, { as: 'family', foreignKey: 'familiesId' })
      Client.belongsTo(models.Group, { as: 'group', foreignKey: 'groupId' })
      Client.hasOne(models.Device, { as: 'device', foreignKey: 'clientId' })
    }
  };
  Client.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "field name is required"
        }
      }
    },
    img: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "field address is required"
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
    contact: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "field contact is required"
        }
      }
    },
    birth_date: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: "field birth date is required"
        }
      }
    },
    familiesId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'field family id is required'
        }
      }
    },
    groupId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'field group id is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};