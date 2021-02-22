'use strict';

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Histories', [{
        longitude: 21.435957167256333,
        latitude: 39.82456281213858,
        clientId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        longitude: 21.405176,
        latitude: 39.882204,
        clientId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async(queryInterface, Sequelize) => {

  }
};