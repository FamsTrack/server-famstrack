'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.Client, { as: 'client', foreignKey: 'groupId' })
      Group.hasMany(models.Schedule)
    }
  };
  Group.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field name is required'
        }
      }
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'field year is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};