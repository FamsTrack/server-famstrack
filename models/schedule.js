'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Group)
    }
  };
  Schedule.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field name is required'
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
    date: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field date is required'
        },
        dateFormat(value) {
          let arr = value.split('-')
          if (value[4] !== '-' || arr[1] > 12) {
            throw new Error('date format should be yyyy/mm/dd')
          }
        }
      }
    },
    time: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field time is required'
        },
        timeFormat(value) {
          if (value.split(':')[0] > 23) {
            throw new Error('time format should be hh:mm')
          }
        }
      }
    },
    GroupId: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'field GroupId is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};