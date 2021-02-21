'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    return queryInterface.addColumn('Clients', 'groupId', {
      type: Sequelize.INTEGER
    })
  },

  down: async(queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Clients', 'groupId')
  }
};