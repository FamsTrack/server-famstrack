'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Groups', [
     {
        name: 'Jakarta Timur',
        year: 2021,
        createdAt: new Date(),
        updatedAt: new Date()
     },
     {
        name: 'Jakarta Selatan',
        year: 2021,
        createdAt: new Date(),
        updatedAt: new Date()
     }
   ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Groups', null)
  }
};
