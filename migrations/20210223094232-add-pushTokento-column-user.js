'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'pushToken', {
      type: Sequelize.STRING
    })
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'pushToken')
  }
};