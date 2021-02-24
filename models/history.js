'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      History.belongsTo(models.Device, { as: 'device', foreignKey: 'deviceId' })
      History.belongsTo(models.Client, { as: 'client', foreignKey: 'clientId' })
    }
  };
  History.init({
    longitude: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: 'field is longitude required'
      }
    },
    latitude: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: 'field is latitude required'
      }
    },
    deviceId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: 'field is device id required'
      }
    },
    clientId: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: 'field is client id required'
      }
    }
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};