'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  News.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field name is required'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field image is required'
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field description is required'
        }
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
      validate: {
        notEmpty: {
          msg: 'field active is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};