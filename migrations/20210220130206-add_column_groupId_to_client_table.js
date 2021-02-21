'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return queryInterface.addColumn('Clients', 'groupId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Groups',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    })
  },

  down: async(queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Clients', 'groupId')
  }
};